import PropTypes from 'prop-types'
import React from 'react'

const minimumContracts = 14

const UploadButton = ({ contracts = minimumContracts, actions }) => {
	const onUploadClick = (type) => () => {
		if (contracts < minimumContracts) {
			HyperspaceAPI.showError({
				title: 'Hyperspace files error',
				content:
					'Not enough contracts to upload.  You must buy storage before uploading, or wait for contracts to form.',
			})
			return
		}
		let dialogProperties
		if (type === 'folder') {
			dialogProperties = ['openDirectory']
		} else if (type === 'file') {
			dialogProperties = ['openFile', 'multiSelections']
		}
		const filepaths = HyperspaceAPI.openFile({
			title: 'Choose a ' + type + ' to upload',
			properties: dialogProperties,
		})
		if (filepaths) {
			actions.showUploadDialog(filepaths)
		}
	}
	return (
		<div className="upload-button-container">
			<div onClick={onUploadClick('file')} className="upload-button">
				<button> Upload Files </button>
			</div>
			<div onClick={onUploadClick('folder')} className="upload-button">
				<button> Upload Folder </button>
			</div>
		</div>
	)
}

UploadButton.propTypes = {
	contracts: PropTypes.number,
}

export default UploadButton
