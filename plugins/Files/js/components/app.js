import PropTypes from 'prop-types'
import React from 'react'
import FileBrowser from '../containers/filebrowser.js'
import FileTransfers from '../containers/filetransfers.js'
import AllowanceDialog from '../containers/allowancedialog.js'
import SideBar from '../containers/sidebar.js'

const FilesApp = ({ showAllFiles, showFileTransfers, showAllowanceDialog }) => (
	<div className="app">
		{showAllowanceDialog ? <AllowanceDialog /> : null}
		<SideBar />
		<div id="main-panel">
			{showAllFiles ? <FileBrowser /> : null}
			{showFileTransfers ? <FileTransfers /> : null}
		</div>
	</div>
)

FilesApp.propTypes = {
	showAllowanceDialog: PropTypes.bool.isRequired,
}

export default FilesApp
