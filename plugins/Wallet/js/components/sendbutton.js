import PropTypes from 'prop-types'
import React from 'react'

const SendButton = ({ currencytype, onClick }) => (
	<div onClick={onClick} className="wallet-button send-button">
		<i className="fa fa-paper-plane" />
		<span>Send Space Cash</span>
	</div>
)

SendButton.propTypes = {
	currencytype: PropTypes.string.isRequired,
}

export default SendButton
