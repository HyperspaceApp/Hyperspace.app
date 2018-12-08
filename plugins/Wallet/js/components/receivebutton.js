import React from 'react'
import { MENU_WALLET_RECEIVE_SPACECASH } from '../constants/wallet.js'

const ReceiveButton = ({ actions, selected }) => {
	const handleReceiveButtonClick = () => actions.showReceivePrompt()
	return (
		<div
			className={`wallet-button receive-button ${selected?'selected':''}`}
			onClick={handleReceiveButtonClick}
		>
			<img src={MENU_WALLET_RECEIVE_SPACECASH} />
			<span>Receive Space Cash</span>
		</div>
	)
}

export default ReceiveButton
