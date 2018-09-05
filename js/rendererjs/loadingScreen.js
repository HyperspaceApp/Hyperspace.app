// loadingScreen.js: display a loading screen until communication with Hsd has been established.
// if an available daemon is not running on the host,
// launch an instance of hsd using config.js.
import { remote, shell } from 'electron'
import * as Hsd from 'hyperspace.js'
import Path from 'path'
import React from 'react'
import ReactDOM from 'react-dom'
import StatusBar from './statusbar.js'

const dialog = remote.dialog
const app = remote.app
const fs = remote.require('fs')
const config = remote.getGlobal('config')
const hsdConfig = config.attr('hsd')

const spinner = document.getElementById('loading-spinner')
const overlay = document.getElementsByClassName('overlay')[0]
const overlayText = overlay
	.getElementsByClassName('centered')[0]
	.getElementsByTagName('p')[0]
const errorLog = document.getElementById('errorlog')
overlayText.textContent = 'Loading Hyperspace...'

const showError = (error) => {
	overlayText.style.display = 'none'
	errorLog.textContent =
		'A critical error loading Hyperspace has occured: ' + error
	errorLog.style.display = 'inline-block'
	spinner.style.display = 'none'
}

// startUI starts a Hyperspace instance using the given welcome message.
// calls initUI() after displaying a welcome message.
const startUI = (welcomeMsg, initUI) => {
	// Display a welcome message, then initialize the ui
	overlayText.innerHTML = welcomeMsg

	// Construct the status bar component and poll for updates from Hsd
	const updateSyncStatus = async function() {
		try {
			const consensusData = await Hsd.call(hsdConfig.address, {
				timeout: 500,
				url: '/consensus',
			})
			const gatewayData = await Hsd.call(hsdConfig.address, {
				timeout: 500,
				url: '/gateway',
			})
			ReactDOM.render(
				<StatusBar
					peers={gatewayData.peers.length}
					synced={consensusData.synced}
					blockheight={consensusData.height}
				/>,
				document.getElementById('statusbar')
			)
			await new Promise((resolve) => setTimeout(resolve, 5000))
		} catch (e) {
			await new Promise((resolve) => setTimeout(resolve, 500))
			console.error('error updating sync status: ' + e.toString())
		}
		updateSyncStatus()
	}

	updateSyncStatus()

	initUI(() => {
		overlay.style.display = 'none'
	})
}

// checkHyperspacePath validates config's Hyperspace path.  returns a promise that is
// resolved with `true` if hsdConfig.path exists or `false` if it does not
// exist.
const checkHyperspacePath = () =>
	new Promise((resolve) => {
		fs.stat(hsdConfig.path, (err) => {
			if (!err) {
				resolve(true)
			} else {
				resolve(false)
			}
		})
	})

// unexpectedExitHandler handles an unexpected hsd exit, displaying the error
// piped to hsd-output.log.
const unexpectedExitHandler = () => {
	try {
		const errorMsg = fs.readFileSync(
			Path.join(hsdConfig.datadir, 'hsd-output.log')
		)
		showError('Hsd unexpectedly exited. Error log: ' + errorMsg)
	} catch (e) {
		showError('Hsd unexpectedly exited.')
	}
}

// Check if Hsd is already running on this host.
// If it is, start the UI and display a welcome message to the user.
// Otherwise, start a new instance of Hsd using config.js.
export default async function loadingScreen(initUI) {
	// Create the Hyperspace data directory if it does not exist
	try {
		fs.statSync(hsdConfig.datadir)
	} catch (e) {
		fs.mkdirSync(hsdConfig.datadir)
	}
	// If Hyperspace is already running, start the UI with a 'Welcome Back' message.
	const running = await Hsd.isRunning(hsdConfig.address)
	if (running) {
		startUI('Welcome back', initUI)
		return
	}

	// check hsdConfig.path, if it doesn't exist optimistically set it to the
	// default path
	if (!await checkHyperspacePath()) {
		hsdConfig.path = config.defaultHsdPath
	}

	// check hsdConfig.path, and ask for a new path if hsd doesn't exist.
	if (!await checkHyperspacePath()) {
		// config.path doesn't exist.  Prompt the user for hsd's location
		dialog.showErrorBox(
			'Hsd not found',
			"Hyperspace couldn't locate hsd.  Please navigate to hsd."
		)
		const hsdPath = dialog.showOpenDialog({
			title: 'Please locate hsd.',
			properties: ['openFile'],
			defaultPath: Path.join('..', hsdConfig.path),
			filters: [{ name: 'hsd', extensions: ['*'] }],
		})
		if (typeof hsdPath === 'undefined') {
			// The user didn't choose hsd, we should just close.
			app.quit()
			// if we quit, there is no hsdPath to access
		} else {
			hsdConfig.path = hsdPath[0]
		}
	}

	// Launch the new Hsd process
	try {
		const hsdProcess = Hsd.launch(hsdConfig.path, {
			'hyperspace-directory': hsdConfig.datadir,
			'rpc-addr': hsdConfig.rpcaddr,
			'host-addr': hsdConfig.hostaddr,
			'api-addr': hsdConfig.address,
			modules: 'cghrtw',
		})
		hsdProcess.on('error', (e) => showError('Hsd couldnt start: ' + e.toString()))
		hsdProcess.on('close', unexpectedExitHandler)
		hsdProcess.on('exit', unexpectedExitHandler)
		window.hsdProcess = hsdProcess
	} catch (e) {
		showError(e.toString())
		return
	}

	// Set a timeout to display a warning message about long load times caused by rescan.
	setTimeout(() => {
		if (overlayText.textContent === 'Loading Hyperspace...') {
			overlayText.innerHTML =
				'Loading can take a while after upgrading to a new version. Check the <a style="text-decoration: underline; cursor: pointer" id="releasenotelink">release notes</a> for more details.'

			document.getElementById('releasenotelink').onclick = () => {
				shell.openExternal(
					'https://github.com/HyperspaceApp/Hyperspace.app/releases'
				)
			}
		}
	}, 30000)

	// Wait for this process to become reachable before starting the UI.
	const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
	while ((await Hsd.isRunning(hsdConfig.address)) === false) {
		await sleep(500)
	}
	// Unregister callbacks
	window.hsdProcess.removeAllListeners('error')
	window.hsdProcess.removeAllListeners('exit')
	window.hsdProcess.removeAllListeners('close')

	startUI('Welcome to Hyperspace', initUI)
}
