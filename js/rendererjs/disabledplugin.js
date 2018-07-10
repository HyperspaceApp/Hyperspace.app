import PropTypes from 'prop-types'
import React from 'react'
import { shell } from 'electron'

const containerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	backgroundColor: '#C6C6C6',
	width: '100%',
	height: '100%',
}

const errorLogStyle = {
	height: '300px',
	width: '80%',
	overflow: 'auto',
	marginBottom: '15px',
}

const reportStyle = {
	color: 'blue',
	cursor: 'pointer',
}

const handleReport = () => {
	shell.openExternal('https://github.com/HyperspaceApp/Hyperspace/issues')
}


const DisabledPlugin = ({errorMsg, startHsd}) => (
	<div style={containerStyle}>
		<h2>Hsd has exited unexpectedly. Please submit a bug report including the error log <a style={reportStyle} onClick={handleReport}>here.</a></h2>
		<h2> Error Log: </h2>
		<textarea style={errorLogStyle} readOnly>
			{errorMsg}
		</textarea>
		<button onClick={startHsd}>Start Hsd</button>
	</div>
)

DisabledPlugin.propTypes = {
	errorMsg: PropTypes.string.isRequired,
	startHsd: PropTypes.func.isRequired,
}

export default DisabledPlugin
