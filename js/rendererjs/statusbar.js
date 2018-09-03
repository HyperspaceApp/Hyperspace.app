import PropTypes from 'prop-types'
import React from 'react'

// -- helper functions --

// currentEstimatedHeight returns the estimated block height for the current time.
const currentEstimatedHeight = () => {
	const knownBlockHeight = 5000
	const knownBlockTime = new Date(1535515310 * 1000) // timestamp for block 5000
	const blockTime = 9 // minutes
	const diffMinutes = Math.abs(new Date() - knownBlockTime) / 1000 / 60

	const estimatedHeight = knownBlockHeight + diffMinutes / blockTime

	return Math.floor(estimatedHeight + 0.5) // round to the nearest block
}

// estimatedProgress returns the estimated sync progress given the current
// blockheight, as a number from 0 -> 99.9
const estimatedProgress = (currentHeight) =>
	Math.min(currentHeight / currentEstimatedHeight() * 100, 99.9)

// -- components --

const StatusBar = ({ synced, blockheight, peers }) => {
	const progress = estimatedProgress(blockheight)

	const redColor = '#E0000B'

	const syncStyle = {
		color: redColor,
	}

	const syncProgressStyle = {
		width: progress.toString() + '%',
		height: '11px',
		transition: 'width 200ms',
		backgroundColor: '#4ad963',
		margin: '0',
		borderRadius: "10px",
	}

	const syncProgressContainerStyle = {
		display: 'inline-block',
		backgroundColor: '#0e191f',
		height: '11px',
		width: '150px',
		borderRadius: "10px",
	}

	let status
	if (!synced && peers === 0) {
		status = 'Not Synchronizing'
	} else if (!synced && peers > 0) {
		status = 'Synchronizing'
	} else if (synced && peers === 0) {
		status = 'No Peers'
	} else if (synced) {
		status = 'Synchronized'
	}
	syncStyle.color = 'white'

	let syncStatus = (
		<div className="status-bar-blockheight">Block Height: {blockheight}</div>
	)

	if (!synced && progress < 99.9) {
		syncStatus = (
			<div>
				<div style={syncProgressContainerStyle}>
					<div style={syncProgressStyle} />
				</div>
			</div>
		)
	}

	return (
		<div className="status-bar">
			<div style={syncStyle}>
				{status}
			</div>
			{syncStatus}
		</div>
	)
}

StatusBar.propTypes = {
	synced: PropTypes.bool.isRequired,
	blockheight: PropTypes.number.isRequired,
	peers: PropTypes.number.isRequired,
}

export default StatusBar
