import { remote } from 'electron'
import path from 'path'
import fs from 'graceful-fs'
const { app } = remote
const appEntry =
	process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath()
const pluginDirectory = path.join(appEntry, 'plugins')

// Scan a folder at `location` for plugins.
// Return a list of folder paths that have a valid plugin structure.
function scanFolder(location) {
	let pluginFolders = fs.readdirSync(location)
	pluginFolders = pluginFolders.map((folder) => path.join(location, folder))
	pluginFolders = pluginFolders.filter((pluginPath) => {
		const markupPath = path.join(pluginPath, 'index.html')
		try {
			fs.statSync(markupPath)
			return true
		} catch (e) {
			console.error('plugin ' + pluginPath + ' has an invalid structure')
		}
		return false
	})
	return pluginFolders
}

// pushToBottom pushes a plugin to the bottom of a plugin list
export const pushToBottom = (plugins, target) =>
	plugins.sort((p) => (getPluginName(p) === target ? 1 : 0))

// pushToTop pushes a plugin to the top of a plugin list
export const pushToTop = (plugins, target) =>
	plugins.sort((p) => (getPluginName(p) === target ? -1 : 0))

// Scan a folder at path and return an ordered list of plugins.
// The plugin specified by `homePlugin` is always moved to the top of the list,
// if it exists.
function getOrderedPlugins(path, homePlugin) {
	let plugins = scanFolder(path)

	// Push the Terminal plugin to the bottom
	plugins = pushToBottom(plugins, 'Terminal')

	// Push the About plugin to the bottom
	plugins = pushToBottom(plugins, 'About')

	// Push the home plugin to the top
	plugins = pushToTop(plugins, homePlugin)

	return plugins
}

// Get the name of a plugin from its path.
const getPluginName = (pluginPath) => path.basename(pluginPath)

// Sets the default plugin to show on boot
const defaultHomePlugin = 'Files'

export default {
	plugins: getOrderedPlugins(pluginDirectory, defaultHomePlugin),
}
