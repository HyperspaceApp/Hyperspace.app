// Imported Electron modules
import Path from 'path'
import * as Hsd from 'hyperspace.js'
import loadingScreen from './loadingScreen.js'
import { remote, ipcRenderer } from 'electron'
import { unloadPlugins, loadPlugin, setCurrentPlugin, getOrderedPlugins, getPluginName } from './plugins.js'

const App = remote.app
const mainWindow = remote.getCurrentWindow()
const appEntry = process.env.NODE_ENV === 'development'
  ? process.cwd()
  : App.getAppPath()
const defaultPluginDirectory = Path.join(appEntry, 'plugins')
const defaultHomePlugin = 'Files'
const config = remote.getGlobal('config')
window.closeToTray = mainWindow.closeToTray

// Called at window.onload by the loading screen.
// Wait for hsd to load, then load the plugin system.
function init(callback) {
	// Initialize plugins.
	const plugins = getOrderedPlugins(defaultPluginDirectory, defaultHomePlugin)
	let homePluginView
	// Load each plugin element into the UI
	for (let i = 0; i < plugins.size; i++) {
		const plugin = (() => {
			if (getPluginName(plugins.get(i)) === 'Logs') {
				return loadPlugin(plugins.get(i), true, 'Ctrl+Shift+L')
			}
			return loadPlugin(plugins.get(i))
		})()

		if (getPluginName(plugins.get(i)) === defaultHomePlugin) {
			homePluginView = plugin
		}
	}
	const onHomeLoad = () => {
		setCurrentPlugin(defaultHomePlugin)
		homePluginView.removeEventListener('dom-ready', onHomeLoad)
		callback()
	}
	// wait for the home plugin to load before calling back
	homePluginView.addEventListener('dom-ready', onHomeLoad)
}

// shutdown triggers a clean shutdown of hsd.
const shutdown = async () => {
	unloadPlugins()

	const overlay = document.getElementsByClassName('overlay')[0]
	const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0]
	const hsdConfig = config.attr('hsd')

	overlay.style.display = 'inline-flex'
	overlayText.textContent = 'Quitting Hyperspace...'

	// Block, displaying Quitting Hyperspace..., until Hsd has stopped.
	if (typeof window.hsdProcess !== 'undefined') {
		setTimeout(() => window.hsdProcess.kill('SIGKILL'), 15000)
		Hsd.call(hsdConfig.address, '/daemon/stop')
		const running = (pid) => {
			try {
				process.kill(pid, 0)
				return true
			} catch (e) {
				return false
			}
		}
		const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
		while (running(window.hsdProcess.pid)) {
			await sleep(200)
		}
	}

	mainWindow.destroy()
}

// Register an IPC callback for triggering clean shutdown
ipcRenderer.on('quit', async () => {
	await shutdown()
})

// If closeToTray is set, hide the window and cancel the close.
// On windows, display a balloon notification on first hide
// to inform users that Hyperspace.app is still running.  NOTE: returning any value
// other than `undefined` cancels the close.
let hasClosed = false
window.onbeforeunload = () => {
	if (window.closeToTray) {
		if (mainWindow.isVisible() === false) {
			mainWindow.restore()
			shutdown()
			return false
		}

		if (process.platform === 'linux') {
			// minimize is not supported in all linux WM/DEs, so we hide instead
			mainWindow.hide()
		} else {
			// minimize is supported by both windows and MacOS.
			mainWindow.minimize()
		}

		if (process.platform === 'win32' && !hasClosed) {
			mainWindow.tray.displayBalloon({
				title: 'Hyperspace information',
				content: 'Hyperspace is still running.  Right click this tray icon to quit or restore Hyperspace.',
			})
			hasClosed = true
		}
		return false
	}
	shutdown()
	return false
}

// Once the main window loads, start the loading process.
window.onload = function() {
	loadingScreen(init)
}

