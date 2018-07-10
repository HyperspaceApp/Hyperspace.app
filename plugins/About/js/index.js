'use strict'
import { platform } from 'os'
import { shell } from 'electron'

// Set UI version via package.json.
document.getElementById('uiversion').innerHTML = VERSION

// Set daemon version via API call.
HyperspaceAPI.call('/daemon/version', (err, result) => {
	if (err) {
		HyperspaceAPI.showError('Error', err.toString())
	} else {
		document.getElementById('hsdversion').innerHTML = result.version
	}
})

function genDownloadLink(version, thePlatform) {
	let plat = thePlatform
	if (plat === 'darwin') {
		plat = 'osx'
	}

	return `https://github.com/HyperspaceApp/Hyperspace.app/releases/download/v${version}/Hyperspace-v${version}-${plat}-x64.zip`
}

function updateCheck() {
	HyperspaceAPI.call('/daemon/update', (err, result) => {
		if (err) {
			HyperspaceAPI.showError('Error', err.toString())
		} else if (result.available) {
			document.getElementById('newversion').innerHTML = result.version
			document.getElementById('downloadlink').href = genDownloadLink(result.version, platform())
			document.getElementById('nonew').style.display = 'none'
			document.getElementById('yesnew').style.display = 'block'
		} else {
			document.getElementById('nonew').style.display = 'block'
			document.getElementById('yesnew').style.display = 'none'
		}
	})
}

document.getElementById('updatecheck').onclick = updateCheck
document.getElementById('datadiropen').onclick = () => {
	shell.showItemInFolder(HyperspaceAPI.config.hsd.datadir)
}
