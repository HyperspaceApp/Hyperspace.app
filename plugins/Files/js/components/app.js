import PropTypes from 'prop-types'
import React from 'react'
import FileBrowser from '../containers/filebrowser.js'
import AllowanceDialog from '../containers/allowancedialog.js'
import SideBar from '../containers/sidebar.js'

const FilesApp = ({showAllowanceDialog}) => (
	<div className="app">
		{showAllowanceDialog ? <AllowanceDialog /> : null}
		<SideBar />
		<div id="main-panel" className="pure-u-19-24">
			<FileBrowser />
		</div>
	</div>
)

FilesApp.propTypes = {
	showAllowanceDialog: PropTypes.bool.isRequired,
}

export default FilesApp
