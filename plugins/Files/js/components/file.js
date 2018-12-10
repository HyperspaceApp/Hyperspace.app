import PropTypes from 'prop-types'
import React from 'react'
import RedundancyStatus from './redundancystatus.js'
import { FILES_ICON_DOCUMENT, FILES_ICON_FOLDER} from '../constants/files.js'

const File = ({filename, type, selected, isDragTarget, filesize, available, redundancy, uploadprogress, onDoubleClick, onClick, setDragUploadEnabled, setDragFolderTarget, setDragFileOrigin, handleDragRename, isHyperspaceAppFolder }) => {
	const handleDrag = () => {
	}
	const handleDragStart = () => {
		setDragUploadEnabled(false)
		setDragFileOrigin({type: type, name: filename, isHyperspaceAppFolder: isHyperspaceAppFolder})
		setDragFolderTarget('')
	}
	const handleDragEnd = () => {
		setDragUploadEnabled(true)
		handleDragRename()
	}
	const handleDragOver = () => {
		if (type === 'directory') {
			setDragFolderTarget(filename)
		} else {
			setDragFolderTarget('')
		}
	}
	const fileClass = (() => {
		if (isDragTarget) {
			return 'filebrowser-file dragtarget'
		}
		if (selected) {
			return 'filebrowser-file selected'
		}
		return 'filebrowser-file'
	})()
	return (
		<li draggable
			onDrag={handleDrag}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			className={fileClass}
		>
			<div className="filename">
				{type === 'file' ? <img src={FILES_ICON_DOCUMENT} className="icon" /> : <img src={FILES_ICON_FOLDER} className="icon" onClick={onDoubleClick} />}
				<div className="name">{filename}</div>
			</div>
			<div className="file-info">
				<span className="filesize">{filesize}</span>
				<RedundancyStatus available={available} redundancy={redundancy} uploadprogress={uploadprogress} />
			</div>
		</li>
	)
}

File.propTypes = {
	filename: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	filesize: PropTypes.string.isRequired,
	available: PropTypes.bool.isRequired,
	redundancy: PropTypes.number,
	uploadprogress: PropTypes.number,
	selected: PropTypes.bool.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default File
