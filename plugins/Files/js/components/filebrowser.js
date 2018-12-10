import PropTypes from 'prop-types'
import React from 'react'
import FileList from '../containers/filelist.js'
import SetAllowanceButton from '../containers/setallowancebutton.js'
import SearchButton from '../containers/searchbutton.js'
import SearchField from '../containers/searchfield.js'
import UploadDialog from '../containers/uploaddialog.js'
import UploadButton from '../containers/uploadbutton.js'
import DeleteDialog from '../containers/deletedialog.js'
import RenameDialog from '../containers/renamedialog.js'
import DragOverlay from './dragoverlay.js'
import AddFolderButton from '../containers/addfolderbutton.js'
import AddFolderDialog from '../containers/addfolderdialog.js'

const FileBrowser = ({
	dragging,
	dragUploadEnabled,
	settingAllowance,
	showAddFolderDialog,
	showRenameDialog,
	showUploadDialog,
	showDeleteDialog,
	showSearchField,
	path,
	actions,
}) => {
	const onDragOver = (e) => {
		if (!dragUploadEnabled) {
			return
		}
		e.preventDefault()
		actions.setDragging()
	}
	const onDrop = (e) => {
		if (!dragUploadEnabled) {
			return
		}
		e.preventDefault()
		actions.setNotDragging()
		// Convert file list into a list of file paths.
		actions.showUploadDialog(
			Array.from(e.dataTransfer.files, (file) => file.path)
		)
	}
	const onDragLeave = (e) => {
		if (!dragUploadEnabled) {
			return
		}
		e.preventDefault()
		actions.setNotDragging()
	}
	const onKeyDown = (e) => {
		// Deselect all files when ESC is pressed.
		if (e.keyCode === 27) {
			actions.deselectAll()
		}
	}
	const onAllFilesClick = () => {
		actions.setPath('')
	}
	const cleanPath = path.replace(/\/$/, '')
	const pathArray = cleanPath === '' ? null : cleanPath.split('/').reduce((accumulator, currentValue) => {
		if (accumulator.length == 0) {
			return [...accumulator, [currentValue]]
		}
		return [...accumulator, [...accumulator.slice(-1)[0], currentValue]]
	}, [])
	const pathEle = pathArray == null ? null : pathArray.map((arr, key) => {
		const onPathClick = () => {
			actions.setPath(arr.join('/'))
		}
		return (<div key={key} onClick={onPathClick} className="folder-name">><span>{arr.slice(-1)[0]}</span></div>)
	})
	return (
		<div className="file-browser-container">
			<div
				className="file-browser"
				onKeyDown={onKeyDown}
				tabIndex="1"
				onDragOver={onDragOver}
				onMouseLeave={onDragLeave}
				onDrop={onDrop}
			>
				{showRenameDialog ? <RenameDialog /> : null}
				{showUploadDialog ? <UploadDialog /> : null}
				{showDeleteDialog ? <DeleteDialog /> : null}
				{showAddFolderDialog ? <AddFolderDialog /> : null}
				{dragging ? <DragOverlay /> : null}
				<div className="files-toolbar">
				    <div className="path-navi">
						<div onClick={onAllFilesClick} className="all-files">All Files</div>
						{pathEle}
					</div>
					<div className="buttons">
						{showSearchField ? <SearchField /> : null}
						{!settingAllowance ? <SetAllowanceButton /> : null}
						<SearchButton />
						<AddFolderButton />
						<UploadButton />
					</div>
				</div>
				<FileList />
			</div>
		</div>
	)
}

FileBrowser.propTypes = {
	dragging: PropTypes.bool.isRequired,
	settingAllowance: PropTypes.bool.isRequired,
	showRenameDialog: PropTypes.bool.isRequired,
	showUploadDialog: PropTypes.bool.isRequired,
	showDeleteDialog: PropTypes.bool.isRequired,
	showFileTransfers: PropTypes.bool.isRequired,
	dragUploadEnabled: PropTypes.bool.isRequired,
}

export default FileBrowser
