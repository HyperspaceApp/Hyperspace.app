// pluginapi.js: Hyperspace.app plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import * as Hsd from 'hyperspace.js'
import { remote } from 'electron'
import React from 'react'
import DisabledPlugin from './disabledplugin.js'
import Path from 'path'

const dialog = remote.dialog
const mainWindow = remote.getCurrentWindow()
const config = remote.getGlobal('config')
const hsdConfig = config.hsd
const fs = remote.require('fs')
let disabled = false

const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))

window.onload = async function() {
	// ReactDOM needs a DOM in order to be imported,
	// but the DOM is not available until the plugin has loaded.
	// therefore, we have to global require it inside the window.onload event.

	/* eslint-disable global-require */
	const ReactDOM = require('react-dom')
	/* eslint-enable global-require */

	let startHsd = () => {}

	const renderHsdCrashlog = () => {
		// load the error log and display it in the disabled plugin
		let errorMsg = 'Hsd exited unexpectedly for an unknown reason.'
		try {
			errorMsg = fs.readFileSync(
				Path.join(hsdConfig.datadir, 'hsd-output.log'),
				{ encoding: 'utf-8' }
			)
		} catch (e) {
			console.error('error reading error log: ' + e.toString())
		}

		document.body.innerHTML =
			'<div style="width:100%;height:100%;" id="crashdiv"></div>'
		ReactDOM.render(
			<DisabledPlugin errorMsg={errorMsg} startHsd={startHsd} />,
			document.getElementById('crashdiv')
		)
	}

	startHsd = () => {
		const hsdProcess = Hsd.launch(hsdConfig.path, {
			'hyperspace-directory': hsdConfig.datadir,
			'rpc-addr': hsdConfig.rpcaddr,
			'host-addr': hsdConfig.hostaddr,
			'api-addr': hsdConfig.address,
			modules: 'cghrtw',
		})
		hsdProcess.on('error', renderHsdCrashlog)
		hsdProcess.on('close', renderHsdCrashlog)
		hsdProcess.on('exit', renderHsdCrashlog)
		window.hsdProcess = hsdProcess
	}
	// Continuously check (every 2000ms) if hsd is running.
	// If hsd is not running, disable the plugin by mounting
	// the `DisabledPlugin` component in the DOM's body.
	// If hsd is running and the plugin has been disabled,
	// reload the plugin.
	while (true) {
		const running = await Hsd.isRunning(hsdConfig.address)
		if (running && disabled) {
			disabled = false
			window.location.reload()
		}
		if (!running && !disabled) {
			disabled = true
			renderHsdCrashlog()
		}
		await sleep(2000)
	}
}

window.HyperspaceAPI = {
	call: function(url, callback) {
		Hsd.call(hsdConfig.address, url)
			.then((res) => callback(null, res))
			.catch((err) => callback(err, null))
	},
	config: config,
	hastingsToSpaceCash: Hsd.hastingsToSpaceCash,
	spaceCashToHastings: Hsd.spaceCashToHastings,
	openFile: (options) => dialog.showOpenDialog(mainWindow, options),
	saveFile: (options) => dialog.showSaveDialog(mainWindow, options),
	showMessage: (options) => dialog.showMessageBox(mainWindow, options),
	showError: (options) => dialog.showErrorBox(options.title, options.content),
}
