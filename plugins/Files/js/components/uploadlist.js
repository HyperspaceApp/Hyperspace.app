import PropTypes from 'prop-types'
import React from 'react'
import TransferList from './transferlist.js'
import { List } from 'immutable'

const UploadList = ({ uploads, onUploadClick }) => (
	<div className="uploads">
		<TransferList transfers={uploads} onTransferClick={onUploadClick} isDownload={false} />
	</div>
)

UploadList.propTypes = {
	uploads: PropTypes.instanceOf(List).isRequired,
	onUploadClick: PropTypes.func,
}

export default UploadList
