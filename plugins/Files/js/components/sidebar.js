import PropTypes from 'prop-types'
import React from 'react'
import { FILES_SIDEBAR_MENU_ALL_FILES, FILES_SIDEBAR_MENU_DOWNLOADS, FILES_SIDEBAR_MENU_TRANSFER } from '../constants/files.js'

const SideBar = ({ actions }) => {
	const onAllFiles = (e) => {
		actions.showAllFiles()
    }
	const onTransfer = (e) => {
		actions.showTransfer()
	}
    return (
        <div id="sidebar" className="pure-u-5-24">
            <h1>Files</h1>
            <div onClick={onAllFiles} className="files-button">
                <img src={FILES_SIDEBAR_MENU_ALL_FILES} />
                <span>All files</span>
            </div>
            <div onClick={onTransfer} className="files-button">
                <img src={FILES_SIDEBAR_MENU_TRANSFER} />
                <span>Transfers</span>
            </div>
        </div>
    )
}

export default SideBar
