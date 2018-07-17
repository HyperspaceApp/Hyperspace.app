import { Menu, BrowserWindow, Tray, app } from 'electron'
import appMenu from './appMenu.js'
import appTray from './trayMenu.js'
import Path from 'path'
import { version, releaseName } from '../../package.json'

// Save window position and bounds every time the window is moved or resized.
const onBoundsChange = (mainWindow, config) => () => {
	const bounds = mainWindow.getBounds()
	for (const b in bounds) {
		config.attr(b, bounds[b])
	}
}

// Main process logic partitioned to other files
// Creates the window and loads index.html
export default function(config) {
	// Create the browser
	const iconPath = Path.join(__dirname, '../', 'assets', 'icon.png')
	const mainWindow = new BrowserWindow({
		icon: iconPath,
		title: 'Hyperspace',
	})
	// Set mainWindow's closeToTray flag from config.
	// This should be used in the renderer to cancel close() events using window.onbeforeunload
	// In dev mode, this feature is disabled as Electron cannot find the path for the tray icon.
	mainWindow.closeToTray = config.closeToTray
	if (process.env.NODE_ENV !== 'development') {
		if (process.platform === 'win32') {
			mainWindow.tray = new Tray(
				Path.join(app.getAppPath(), 'assets', 'trayWin.png')
			)
		} else {
			mainWindow.tray = new Tray(
				Path.join(app.getAppPath(), 'assets', 'trayTemplate.png')
			)
		}
		mainWindow.tray.setToolTip('Hyperspace - Distributed Cloud Storage')
		mainWindow.tray.setContextMenu(appTray(mainWindow))
	}

	// Load the window's size and position
	mainWindow.setBounds(config)
	mainWindow.on('move', onBoundsChange(mainWindow, config))
	mainWindow.on('resize', onBoundsChange(mainWindow, config))

	// Load the index.html of the app.
	const appEntry =
		process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath()
	mainWindow.loadURL(Path.join('file://', appEntry, 'app.html'))
	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false)
	} else {
		// Create the Application's main menu - OSX version might feel weird without a menubar
		Menu.setApplicationMenu(appMenu(mainWindow))

		// Set the about panel's properties
		app.setAboutPanelOptions({
			applicationName: 'Hyperspace',
			applicationVersion: version,
			copyright: 'Hyperspace, LLC',
			version: releaseName,
		})
	}
	return mainWindow
}
