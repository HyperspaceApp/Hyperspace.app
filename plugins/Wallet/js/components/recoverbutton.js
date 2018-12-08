import React from 'react'
import { MENU_WALLET_RECOVER_SEED } from '../constants/wallet.js'

const RecoverButton = ({ actions, selected }) => {
	const handleRecoverButtonClick = () => actions.showSeedRecoveryDialog()
	return (
		<div
			className={`wallet-button recover-button ${selected?'selected':''}`}
			onClick={handleRecoverButtonClick}
		>
			<img src={MENU_WALLET_RECOVER_SEED} />
			<span>Recover Seed</span>
		</div>
	)
}

export default RecoverButton
