import PropTypes from 'prop-types'
import React from 'react'
import { MENU_WALLET_SEND_SPACECASH } from '../constants/wallet.js'

const SendButton = ({ onClick, selected }) => (
	<div
		onClick={onClick}
		className={`wallet-button send-button ${selected ? 'selected' : ''}`}
	>
		<img src={MENU_WALLET_SEND_SPACECASH} />
		<span>Send Space Cash</span>
	</div>
)

export default SendButton
