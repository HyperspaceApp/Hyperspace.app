import Path from 'path'
import fs from 'graceful-fs'
import child_process from 'child_process'
import { Map } from 'immutable'
import http from 'http'
import url from 'url'
import { remote } from 'electron'
import * as constants from '../constants/helper.js'

const app = remote.app

export const checkHyperspacePath = () => new Promise((resolve, reject) => {
	fs.stat(HyperspaceAPI.config.attr('hsc').path, (err) => {
		if (!err) {
			if (Path.basename(HyperspaceAPI.config.attr('hsc').path).indexOf('hsc') !== -1) {
				resolve()
			} else {
				reject({ message: 'Invalid binary name.' })
			}
		} else {
			reject(err)
		}
	})
})

export const initPlugin = () => checkHyperspacePath().catch(() => {
	//Look in the hsd folder for hsc.
	HyperspaceAPI.config.attr('hsc', { path: Path.resolve( Path.dirname(HyperspaceAPI.config.attr('hsd').path), (process.platform === 'win32' ? './hsc.exe' : './hsc') ) })
	checkHyperspacePath().catch(() => {
		// config.path doesn't exist. Prompt the user for hsc's location
		if (!HyperspaceAPI.config.attr('hsc')) {
			HyperspaceAPI.config.attr('hsc', { path: '' })
		}
		HyperspaceAPI.showError({ title: 'Hsc not found', content: 'Hyperspace couldn\'t locate hsc. Please navigate to hsc.' })
		const hscPath = HyperspaceAPI.openFile({
			title: 'Please locate hsc.',
			properties: ['openFile'],
			defaultPath: Path.join('..', HyperspaceAPI.config.attr('hsc').path || './' ),
			filters: [{ name: 'hsc', extensions: ['*'] }],
		})
		if (hscPath) {
			if (Path.basename(hscPath[0]).indexOf('hsc') === -1) {
				HyperspaceAPI.showError({ title: 'Invalid Binary Name', content: 'The hsc binary must be called hsc. Restart the plugin to choose a valid binary.' })
			} else {
				HyperspaceAPI.config.attr('hsc', { path: hscPath[0] })
			}
		} else {
			HyperspaceAPI.showError({ title: 'Hsc not found', content: 'This plugin will be unusable until a proper hsc binary is found.' })
		}
	})
	HyperspaceAPI.config.save()
})

export const commandType = function(commandString, specialArray) {
	//Cleans string and sees if any subarray in array starts with the string when split.
	const args = commandString.replace(/\s*\s/g, ' ').trim().split(' ')
	if (args[0] === './hsc' || args[0] === 'hsc') {
		args.shift()
	}

	//Can't do a simple match because commands can be passed additional arguments.
	return specialArray.findIndex( (command) =>
		command.reduce((matches, argument, i) =>
			(matches && argument === args[i]),
		true) && commandString.indexOf('-h') === -1 //Also covers --help.
		//Don't show a password prompt if user is looking for help.
	)
}

export const getArgumentString = function(commandString, rawCommandSplit) {
	//Parses out ./hsc, hsc, command, and address flags leaving only arguments.

	//Remove leading ./hsc or hsc
	const args = commandString.replace(/\s*\s/g, ' ').trim().split(' ')
	if (args[0] === './hsc' || args[0] === 'hsc') {
		args.shift()
	}

	//Remove command from sting.
	for (const token of rawCommandSplit) {
		if (args[0] === token) {
			args.shift()
		} else {
			console.log(`ERROR: getArgumentString failed, string: ${commandString}, did not contain command: ${rawCommandSplit.join(' ')}`)
			return ''
		}
	}

	//Strip out address flag.
	let index = args.indexOf('-a')
	if  (index === -1) {
		index = args.indexOf('--address')
	}
	if (index !== -1) {
		args.splice(index, 2)
	}
	return args.join(' ')
}

export const spawnCommand = function(commandStr, actions, newid) {
	//Create new command object. Id doesn't need to be unique, just can't be the same for adjacent commands.

	//We set the command first so the user sees exactly what they type. (Minus leading and trailing spaces, double spaces, etc.)
	let commandString = commandStr.replace(/\s*\s/g, ' ').trim()
	const newCommand = Map({ command: commandString, result: '', id: newid, stat: 'running' })
	actions.addCommand(newCommand)

	//Remove surrounding whitespace and leading hsc command.
	if (commandString.startsWith('hsc')) {
		commandString = commandString.slice(4).trim()
	} else if (commandString.startsWith('./hsc')) {
		commandString = commandString.slice(6).trim()
	}

	//Add address flag to hsc.
	let args = commandString.split(' ')
	if (args.indexOf('-a') === -1 && args.indexOf('--address') === -1 && HyperspaceAPI.config.attr('address')) {
		args = args.concat([ '-a', HyperspaceAPI.config.attr('address') ])
	}

	const hsc = child_process.spawn(HyperspaceAPI.config.attr('hsc').path, args, { cwd: app.getPath('downloads') })

	//Update the UI when the process receives new ouput.
	const consumeChunk = function(chunk) {
		const chunkTrimmed = chunk.toString().replace(/stty: stdin isn't a terminal\n/g, '')
		actions.updateCommand(newCommand.get('command'), newCommand.get('id'), chunkTrimmed)
	}
	hsc.stdout.on('data', consumeChunk)
	hsc.stderr.on('data', consumeChunk)

	let closed = false
	const streamClosed = function() {
		if (!closed) {
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			closed = true
		}
	}

	hsc.on('error', (e) => {
		consumeChunk(`Error running command: ${e.message}.\nIs your hsc path correct?`)
		streamClosed()
	})
	hsc.on('close', () => {
		streamClosed()
	})

	//If window is small auto close command overview so we can see the return value.
	if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180) {
		actions.hideCommandOverview()
	}

	return hsc
}

export const httpCommand = function(commandStr, actions, newid) {
	let commandString = commandStr
	const originalCommand = commandStr.replace(/\s*\s/g, ' ').trim()

	//Remove surrounding whitespace and leading hsc command.
	if (commandString.startsWith('hsc')) {
		commandString = commandString.slice(4).trim()
	} else if (commandString.startsWith('./hsc')) {
		commandString = commandString.slice(6).trim()
	}

	//Parse arguments.
	const args = commandString.split(' ')

	//Add address flag to hsc.
	let hyperspaceAddr = url.parse('http://localhost:5580')

	if (args.indexOf('-a') === -1 && args.indexOf('--address') === -1) {
		if (HyperspaceAPI.config.attr('address')) {
			//Load default address.
			hyperspaceAddr = url.parse('http://' + HyperspaceAPI.config.attr('address'))
		}
	} else {
		//Parse address flag.
		let index = args.indexOf('-a')
		if  (index === -1) {
			index = args.indexOf('--address')

		}
		if (index < args.length-1) {
			hyperspaceAddr = url.parse('http://' + args[index+1])
		}
		args.splice(index, 2)
		commandString = args.join(' ')
	}

	let apiURL = ''
	if (commandString === 'wallet unlock') {
		apiURL = '/wallet/unlock'
	} else if (commandString === 'wallet load seed') {
		apiURL = '/wallet/seed'
	} else if (commandString.includes('wallet load 033x', 0)) {
		apiURL = '/wallet/033x'
	} else if (commandString.includes('wallet load siag', 0)) {
		apiURL = '/wallet/siagkey'
	} else if (commandString === 'wallet init-seed --force') {
		apiURL = '/wallet/init/seed?force=true'
	} else if (commandString.includes('wallet init-seed', 0)) {
		apiURL = '/wallet/init/seed'
	} else {
		return spawnCommand(commandString, actions).stdin
	}

	//Spawn new command if we are good to go.
	const newCommand = Map({ command: originalCommand, result: '', id: newid, stat: 'running' })
	actions.addCommand(newCommand)

	//Update the UI when the process receives new ouput.
	let buffer = ''
	const consumeChunk = function(chunk) {
		buffer += chunk.toString()
	}

	let closed = false
	const streamClosed = function(res) {
		if (!closed) {
			try {
				buffer = JSON.parse(buffer).message
			} catch (e) {}

			if (res && res.statusCode >= 200 && res.statusCode <= 299) {
				buffer += 'Success'
			}

			actions.updateCommand(newCommand.get('command'), newCommand.get('id'), buffer)
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			closed = true
		}
	}

	//If window is small auto close command overview so we can see the return value.
	if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180) {
		actions.hideCommandOverview()
	}

	const options = {
		hostname: hyperspaceAddr.hostname,
		port: hyperspaceAddr.port,
		path: apiURL,
		method: 'POST',
		headers: {
			'User-Agent': 'Sia-Agent',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}
	const req = http.request(options, (res) => {
		res.on('data', consumeChunk)
		res.on('end', () => streamClosed(res))
	})
	req.on('error', (e) => {
		consumeChunk(e.message)
		streamClosed()
	})
	return req
}

export const commandInputHelper = function(e, actions, currentCommand, showCommandOverview, newid) {
	const eventTarget = e.target
	//Enter button.
	if (e.keyCode === 13) {

		//Check if command is special.
		switch ( commandType(currentCommand, constants.specialCommands) ) {
		case constants.REGULAR_COMMAND: //Regular command.
			spawnCommand(currentCommand, actions, newid) //Spawn command defined in index.js.
			break

		case constants.WALLET_UNLOCK: //wallet unlock
		case constants.WALLET_033X: //wallet load 033x
		case constants.WALLET_SIAG: //wallet load siag
		case constants.WALLET_SEED: //wallet load seed
			actions.showWalletPrompt()
			break
		case constants.WALLET_INIT_SEED:
			actions.showSeedPrompt()
			break


		case constants.HELP: //help
		case constants.HELP_QMARK: {
			const newText = 'help'
			if (showCommandOverview) {
				actions.hideCommandOverview()
			} else {
				actions.showCommandOverview()
			}

			//The command log won't actually show a help command but we still want to be able to select it in the command history.
			const newCommand = Map({ command: newText, result: '', id: newid })
			actions.addCommand(newCommand)
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			break
		}
		default:
			break
		}
	} else if (e.keyCode === 38) {
		//Up arrow.
		actions.loadPrevCommand(eventTarget.value)
		setTimeout( () => {
			eventTarget.setSelectionRange(eventTarget.value.length, eventTarget.value.length)
		}, 0)
	} else if (e.keyCode === 40) {
		//Down arrow.
		actions.loadNextCommand(eventTarget.value)
		setTimeout(() => {
			eventTarget.setSelectionRange(eventTarget.value.length, eventTarget.value.length)
		}, 0)
	}
}

