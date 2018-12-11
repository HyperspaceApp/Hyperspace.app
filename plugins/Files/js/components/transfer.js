import PropTypes from 'prop-types'
import React from 'react'
import ProgressBar from './progressbar.js'
import { FILES_ICON_DOCUMENT, FILES_TRANSFER_DOWNLOAD, FILES_TRANSFER_UPLOAD, FILES_CONTROL_OPEN_FILE_FOLDER } from '../constants/files.js'

const Transfer = ({name, progress, status, speed, onClick, isDownload}) => {
	const statusText = (status === 'Downloading') ? status + ' - ' + speed : status
	return (
		<li className={`filetransfer ${isDownload ? "is-download" : ""}`} onClick={onClick}>
			<div className="transfer-info">
				<img src={FILES_ICON_DOCUMENT} className="icon" />
				{isDownload ? <img src={FILES_TRANSFER_DOWNLOAD} className="icon" /> : <img src={FILES_TRANSFER_UPLOAD} className="icon" /> }
				<div className="transfername">{name}</div>
				<ProgressBar progress={progress} />
				<div className="transfer-size"></div>
				<div className="transfer-status">{statusText}</div>
				<div className="transfer-actions"></div>
			</div>
		</li>
	)
}

Transfer.propTypes = {
	name: PropTypes.string.isRequired,
	progress: PropTypes.number.isRequired,
	status: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default Transfer
