import PropTypes from 'prop-types'
import React from 'react'
import { FILES_STATUS_DONE, FILES_STATUS_ING } from '../constants/files.js'

const colorNotAvailable = '#FF8080'
const colorGoodRedundancy = '#00CBA0'
const colorNegativeRedundancy = '#b7afaf'

const RedundancyStatus = ({available, redundancy, uploadprogress}) => {
	return (
		<div className="redundancy-status">
			<img src={(!available || redundancy < 1.0) ? FILES_STATUS_ING: FILES_STATUS_DONE} />
			<span className="redundancy-text">{redundancy > 0 ? redundancy + 'x' : '--'}</span>
		</div>
	)
}

RedundancyStatus.propTypes = {
	available: PropTypes.bool.isRequired,
	redundancy: PropTypes.number.isRequired,
	uploadprogress: PropTypes.number.isRequired,
}

export default RedundancyStatus

