import React from 'react'
import { MENU_WALLET_CHANGE_PASSWORD } from '../constants/wallet.js'

const ChangePasswordButton = ({ actions, selected }) => {
	const handleChangePasswordClick = () => actions.showChangePasswordDialog()
	return (
		<div
			className={`wallet-button change-password-button ${
				selected ? 'selected' : ''
			}`}
			onClick={handleChangePasswordClick}
		>
			<img src={MENU_WALLET_CHANGE_PASSWORD} />
			<span>Change Password</span>
		</div>
	)
}

export default ChangePasswordButton
