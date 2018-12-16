// This module handles the construction of Hyperspace.app plugins.
import { List } from 'immutable'
import Path from 'path'
import fs from 'graceful-fs'
import { remote } from 'electron'
const config = remote.getGlobal('config')
const isSpvNode = config.attr('spvNode')

const devtoolsShortcut = 'Ctrl+Shift+P'

// Create an icon element for a plugin button.
const createButtonIconElement = (path) => {
	const i = document.createElement('img')
	i.src = path
	i.className = 'pure-u icon standard'
	return i
}

// Create an icon element for a plugin button.
const createActionButtonIconElement = (path) => {
	const i = document.createElement('img')
	i.src = path
	i.className = 'pure-u icon action'
	return i
}

// Create a text element for a plugin button.
const createButtonTextElement = (name) => {
	const t = document.createElement('div')
	t.innerText = name
	t.className = 'pure-u text'
	return t
}

// Construct a plugin view element from a plugin path and title
const createPluginElement = (markupPath, title) => {
	const elem = document.createElement('webview')
	elem.id = title + '-view'
	elem.className = 'webview'
	elem.src = markupPath
	// This is enabled for legacy plugin support.
	elem.nodeintegration = true
	return elem
}

// registerLocalShortcut registers an electron globalShortcut that is only
// active when the app has focus.
const registerLocalShortcut = (shortcut, action) => {
	remote.app.on('browser-window-blur', () => {
		remote.globalShortcut.unregister(shortcut)
	})
	remote.app.on('browser-window-focus', () => {
		remote.globalShortcut.register(shortcut, action)
	})
	remote.globalShortcut.register(shortcut, action)
}

// Set a plugin as the visible plugin
export const setCurrentPlugin = (pluginName) => {
	const currentElements = document.querySelectorAll('.current')
	for (const elem in currentElements) {
		if (typeof currentElements[elem].classList !== 'undefined') {
			currentElements[elem].classList.remove('current')
		}
	}
	const viewElem = document.getElementById(pluginName + '-view')
	if (viewElem !== null) {
		viewElem.classList.add('current')
	}
	viewElem.focus()

	const buttonElem = document.getElementById(pluginName + '-button')
	if (buttonElem !== null) {
		buttonElem.classList.add('current')
	}
	remote.globalShortcut.unregister(devtoolsShortcut)
	remote.app.removeAllListeners('browser-window-blur')
	remote.app.removeAllListeners('browser-window-focus')
	registerLocalShortcut(devtoolsShortcut, () => {
		viewElem.openDevTools()
	})
}

// Construct a plugin button element from an icon path and title
const createPluginButtonElement = (iconPath, title) => {
	iconPath += '_dark_'
	const elem = document.createElement('span')
	elem.id = title + '-button'
	elem.className = 'nav-button'
	elem.appendChild(createButtonIconElement(iconPath + 'normal.svg'))
	elem.appendChild(createActionButtonIconElement(iconPath + 'action.svg'))
	// elem.appendChild(createButtonTextElement(title))
	// On click, set all other buttons and plugins to non-current except this one.
	elem.onclick = () => setCurrentPlugin(title)
	return elem
}

// Get the name of a plugin from its path.
export const getPluginName = (pluginPath) => Path.basename(pluginPath)

// loadPlugin constructs plugin view and plugin button elements
// and adds these elements to the main UI's mainbar/navbar.
// Returns the plugin's main view element.
export const loadPlugin = (pluginPath, hidden = false, shortcut) => {
	const name = getPluginName(pluginPath)
	const markupPath = Path.join(pluginPath, 'index.html')
	const iconPath = Path.join(pluginPath, 'assets', 'button')

	const viewElement = createPluginElement(markupPath, name)
	const buttonElement = createPluginButtonElement(iconPath, name)

	if (typeof shortcut !== 'undefined') {
		registerLocalShortcut(shortcut, () => {
			setCurrentPlugin(name)
		})
	}
	if (!hidden) {
		document.getElementById('navbar').appendChild(buttonElement)
	}
	document.getElementById('mainbar').appendChild(viewElement)

	return viewElement
}

// unloadPlugins removes the mainbar and the navbar from the document.
export const unloadPlugins = () => {
	const mainbar = document.getElementById('mainbar')
	const navbar = document.getElementById('navbar')
	mainbar.parentNode.removeChild(mainbar)
	navbar.parentNode.removeChild(navbar)
}

// Scan a folder at `path` for plugins.
// Return a list of folder paths that have a valid plugin structure.
export const scanFolder = (path) => {
	let pluginFolders = List(fs.readdirSync(path))
	pluginFolders = pluginFolders.map((folder) => Path.join(path, folder))
	pluginFolders = pluginFolders.filter((pluginPath) => {
		if (isSpvNode) {
			if (getPluginName(pluginPath) == 'Hosting') {
				return false
			}
		}
		const markupPath = Path.join(pluginPath, 'index.html')
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
export const getOrderedPlugins = (path, homePlugin) => {
	let plugins = scanFolder(path)

	plugins = pushToBottom(plugins, 'Files')
	if (!isSpvNode) {
		plugins = pushToBottom(plugins, 'Hosting')
	}
	// Push the Terminal plugin to the bottom
	plugins = pushToBottom(plugins, 'Terminal')

	// Push the About plugin to the bottom
	plugins = pushToBottom(plugins, 'About')

	// Push the home plugin to the top
	plugins = pushToTop(plugins, homePlugin)

	return plugins
}
