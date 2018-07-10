import { Menu } from 'electron'

export default function(window) {
	// Template for Hyperspace tray menu.
	const menutemplate = [
		{
			label: 'Show Hyperspace',
			click: () => window.show(),
		},
		{ type: 'separator' },
		{
			label: 'Hide Hyperspace',
			click: () => window.hide(),
		},
		{ type: 'separator' },
		{
			label: 'Quit Hyperspace',
			click: () => {
				window.webContents.send('quit')
			},
		},
	]

	return Menu.buildFromTemplate(menutemplate)
}
