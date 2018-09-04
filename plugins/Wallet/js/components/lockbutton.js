import React from 'react'
import { MENU_WALLET_LOCK_WALLET } from '../constants/wallet.js'

const LockButton = ({ actions }) => {
	const handleLockButtonClick = () => actions.lockWallet()
	return (
		<div className="wallet-button lock-button" onClick={handleLockButtonClick}>
			<img src={MENU_WALLET_LOCK_WALLET} />
			<span>Lock Wallet</span>
		</div>
	)
}

export default LockButton
