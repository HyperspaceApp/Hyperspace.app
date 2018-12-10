import PropTypes from 'prop-types'
import React from 'react'
import {
	FILES_SIDEBAR_MENU_ALL_FILES,
	FILES_SIDEBAR_MENU_DOWNLOADS,
	FILES_SIDEBAR_MENU_TRANSFER,
} from '../constants/files.js'

const SideBar = ({
	unspent,
	renewheight,
	contractCount,
	showAllFiles,
	showFileTransfers,
	actions,
}) => {
	const onAllFiles = (e) => {
		actions.showAllFiles()
	}
	const onTransfer = (e) => {
		actions.showFileTransfers()
	}
	return (
		<div id="sidebar">
			<h1>Files</h1>
			<div
				onClick={onAllFiles}
				className={`files-button ${showAllFiles ? 'selected' : ''}`}
			>
				<img src={FILES_SIDEBAR_MENU_ALL_FILES} />
				<span>All files</span>
			</div>
			<div
				onClick={onTransfer}
				className={`files-button ${showFileTransfers ? 'selected' : ''}`}
			>
				<img src={FILES_SIDEBAR_MENU_TRANSFER} />
				<span>Transfers</span>
			</div>

			<div id="contract-status">
				<div>
					<b>{unspent}</b> Funds Remaining
				</div>
				<div>
					refilling in <b>{renewheight}</b> height
				</div>
				<div>
					<b>{contractCount}</b> contracts formed
				</div>
			</div>
		</div>
	)
}

export default SideBar
