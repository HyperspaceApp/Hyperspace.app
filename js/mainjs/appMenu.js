import { Menu } from 'electron'

export default function(window) {
	// Template for OSX app menu commands
	// Selectors call the main app's NSApplication methods.
	const menutemplate = [
		{
			label: 'Hyperspace',
			submenu: [
				{
					label: 'About Hyperspace',
					selector: 'orderFrontStandardAboutPanel:',
				},
				{ type: 'separator' },
				{
					label: 'Hide Hyperspace',
					accelerator: 'CmdOrCtrl+H',
					selector: 'hide:',
				},
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click: () => window.webContents.send('quit'),
				},
			],
		},
		{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
				{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					selector: 'selectAll:',
				},
			],
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Toggle Full Screen',
					accelerator: (function() {
						if (process.platform === 'darwin') {
							return 'Ctrl+Command+F'
						} else {
							return 'F11'
						}
					})(),
					click: function(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
						}
					},
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: (function() {
						if (process.platform === 'darwin') {
							return 'Alt+Command+I'
						} else {
							return 'Ctrl+Shift+I'
						}
					})(),
					click: function(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.toggleDevTools()
						}
					},
				},
			],
		},
	]

	return Menu.buildFromTemplate(menutemplate)
}
