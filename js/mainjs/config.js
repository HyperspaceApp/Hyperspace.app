import fs from 'graceful-fs'
import Path from 'path'
import { app } from 'electron'
import { version } from '../../package.json'
import semver from 'semver'

const defaultHsdPath =
	process.env.NODE_ENV === 'development'
		? Path.join(
				__dirname,
				'../../Hyperspace/' + (process.platform === 'win32' ? 'hsd.exe' : 'hsd')
			)
		: Path.join(
				__dirname,
				'../Hyperspace/' + (process.platform === 'win32' ? 'hsd.exe' : 'hsd')
			)

// The default settings
const defaultConfig = {
	homePlugin: 'Overview',
	hsd: {
		path: defaultHsdPath,
		datadir: Path.join(app.getPath('userData'), './hyperspace'),
		rpcaddr: ':5581',
		hostaddr: ':5582',
		detached: false,
		address: '127.0.0.1:5580',
	},
	closeToTray: Boolean(
		process.platform === 'win32' || process.platform === 'darwin'
	),
	width: 1024,
	height: 768,
	x: 0,
	y: 0,
	version: version,
}

/**
 * Holds all config.json related logic
 * @module configManager
 */
export default function configManager(filepath) {
	let config

	try {
		const data = fs.readFileSync(filepath)
		config = JSON.parse(data)
	} catch (err) {
		config = defaultConfig
	}

	// always use the default hsd path after an upgrade
	if (typeof config.version === 'undefined') {
		config.version = version
		config.hsd.path = defaultHsdPath
	} else if (semver.lt(config.version, version)) {
		config.version = version
		config.hsd.path = defaultHsdPath
	}

	// fill out default values if config is incomplete
	config = Object.assign(defaultConfig, config)

	/**
	 * Gets or sets a config attribute
	 * @param {object} key - key to get or set
	 * @param {object} value - value to set config[key] as
	 */
	config.attr = function(key, value) {
		if (value !== undefined) {
			config[key] = value
		}
		if (config[key] === undefined) {
			config[key] = null
		}
		return config[key]
	}

	/**
	 * Writes the current config to defaultConfigPath
	 * @param {string} path - UI's defaultConfigPath
	 */
	config.save = function() {
		fs.writeFileSync(filepath, JSON.stringify(config, null, '\t'))
	}

	/**
	 * Sets config to what it was on disk
	 */
	config.reset = function() {
		config = configManager(filepath)
	}

	// expose the default hsd path
	config.defaultHsdPath = defaultHsdPath

	// Save to disk immediately when loaded
	try {
		config.save()
	} catch (err) {
		console.error('couldnt save config.json: ' + err.toString())
	}

	// Return the config object with the above 3 member functions
	return config
}
