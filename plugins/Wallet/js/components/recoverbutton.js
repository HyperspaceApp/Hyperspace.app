import React from 'react'
import { MENU_WALLET_RECOVER_SEED } from '../constants/wallet.js'

const RecoverButton = ({ actions }) => {
	const handleRecoverButtonClick = () => actions.showSeedRecoveryDialog()
	return (
		<div
			className="wallet-button recover-button"
			onClick={handleRecoverButtonClick}
		>
			<img src={MENU_WALLET_RECOVER_SEED} />
			<span>Recover Seed</span>
		</div>
	)
}

export default RecoverButton
