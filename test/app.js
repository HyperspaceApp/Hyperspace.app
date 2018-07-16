import { Application } from 'spectron'
import { spawn } from 'child_process'
import { expect } from 'chai'
import psTree from 'ps-tree'
import * as Hsd from 'hyperspace.js'
import fs from 'fs'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// getHsdChild takes an input pid and looks at all the child process of that
// pid, returning an object with the fields {exists, pid}, where exists is true
// if the input pid has a 'hsd' child, and the pid is the process id of the
// child.
const getHsdChild = (pid) => new Promise((resolve, reject) => {
	psTree(pid, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMMAND === 'hsd' || child.COMMAND === 'hsd.exe') {
				resolve({exists: true, pid: child.PID})
			}
		})
		resolve({exists: false})
	})
})

// pkillHsd kills all hsd processes running on the machine, used in these
// tests to ensure a clean env
const pkillHsd = () => new Promise((resolve, reject) => {
	psTree(process.pid, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMMAND === 'hsd' || child.COMMAND === 'hsd.exe') {
				if (process.platform === 'win32') {
					spawn('taskkill', ['/pid', child.PID, '/f', '/t'])
				} else {
					process.kill(child.PID, 'SIGKILL')
				}
			}
		})
		resolve()
	})
})

// isProcessRunning leverages the semantics of `process.kill` to return true if
// the input pid is a running process.  If process.kill is initiated with the
// signal set to '0', no signal is sent, but error checking is still performed.
const isProcessRunning = (pid) => {
	try {
		process.kill(pid, 0)
		return true
	} catch (e) {
		return false
	}
}

let electronBinary = './node_modules/electron/dist/electron'
if (process.platform === 'win32') {
	electronBinary = 'node_modules\\electron\\dist\\electron.exe'
} else if (process.platform === 'darwin') {
	electronBinary = './node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'
}


// we need functions for mocha's `this` for setting timeouts.
/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-expressions */
describe('startup and shutdown behaviour', () => {
	after(async () => {
		// never leave a dangling hsd
		await pkillHsd()
	})
	describe('window closing behaviour', function() {
		this.timeout(200000)
		let app
		let hsdProcess
		beforeEach(async () => {
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		afterEach(async () => {
			try {
				await pkillHsd()
				while (isProcessRunning(hsdProcess.pid)) {
					await sleep(10)
				}
				app.webContents.send('quit')
				await app.stop()

			} catch (e) {
			}
		})
		it('hides the window and persists in tray if closeToTray = true', async () => {
			const pid = await app.mainProcess.pid()
			hsdProcess = await getHsdChild(pid)
			app.webContents.executeJavaScript('window.closeToTray = true')
			app.browserWindow.close()
			await sleep(1000)
			expect(await app.browserWindow.isDestroyed()).to.be.false
			expect(await app.browserWindow.isVisible()).to.be.false
			expect(isProcessRunning(hsdProcess.pid)).to.be.true
		})
		it('quits gracefully on close if closeToTray = false', async () => {
			app.webContents.executeJavaScript('window.closeToTray = false')
			const pid = await app.mainProcess.pid()
			expect(hsdProcess.exists).to.be.true

			app.browserWindow.close()
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(hsdProcess.pid)).to.be.false
		})
		it('quits gracefully on close if already minimized and closed again', async () => {
			const pid = await app.mainProcess.pid()
			hsdProcess = await getHsdChild(pid)
			app.webContents.executeJavaScript('window.closeToTray = true')
			app.browserWindow.close()
			await sleep(1000)
			expect(await app.browserWindow.isDestroyed()).to.be.false
			expect(await app.browserWindow.isVisible()).to.be.false
			expect(isProcessRunning(hsdProcess.pid)).to.be.true
			app.browserWindow.close()
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(hsdProcess.pid)).to.be.false
		})
	})
	describe('startup with no hsd currently running', function() {
		this.timeout(120000)
		let app
		let hsdProcess
		before(async () => {
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		after(async () => {
			await pkillHsd()
			while (isProcessRunning(hsdProcess.pid)) {
				await sleep(10)
			}
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
		})
		it('starts hsd and loads correctly on launch', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			hsdProcess = await getHsdChild(pid)
			expect(hsdProcess.exists).to.be.true
		})
		it('gracefully exits hsd on quit', async () => {
			const pid = await app.mainProcess.pid()
			app.webContents.send('quit')
			while (await app.client.isVisible('#overlay-text') === false) {
				await sleep(10)
			}
			while (await app.client.getText('#overlay-text') !== 'Quitting Hyperspace...') {
				await sleep(10)
			}
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(hsdProcess.pid)).to.be.false
		})
	})
	describe('startup with a hsd already running', function() {
		this.timeout(120000)
		let app
		let hsdProcess
		before(async () => {
			if (!fs.existsSync('hyperspace-testing')) {
				fs.mkdirSync('hyperspace-testing')
			}
			hsdProcess = Hsd.launch(process.platform === 'win32' ? 'Hyperspace\\hsd.exe' : './Hyperspace/hsd', {
				'hyperspace-directory': 'hyperspace-testing',
			})
			while (await Hsd.isRunning('localhost:9980') === false) {
				await sleep(10)
			}
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		after(async () => {
			await pkillHsd()
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
			while (isProcessRunning(hsdProcess.pid)) {
				await sleep(10)
			}
		})
		it('connects and loads correctly to the running hsd', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			const childHsd = await getHsdChild(pid)
			expect(childHsd.exists).to.be.false
		})
		it('doesnt quit hsd on exit', async () => {
			const pid = await app.mainProcess.pid()
			app.webContents.send('quit')
			while (isProcessRunning(pid)) {
				await sleep(200)
			}
			expect(isProcessRunning(hsdProcess.pid)).to.be.true
			hsdProcess.kill('SIGKILL')
		})
	})
})

/* eslint-enable no-invalid-this */
/* eslint-enable no-unused-expressions */
