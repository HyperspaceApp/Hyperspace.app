import React from 'react'
import { MENU_WALLET_BACKUP_WALLET } from '../constants/wallet.js'

const BackupButton = ({ actions, selected }) => {
	const handleClick = () => actions.showBackupPrompt()
	return (
		<div
			onClick={handleClick}
			className={`wallet-button backup-button ${selected ? 'selected' : ''}`}
		>
			<img src={MENU_WALLET_BACKUP_WALLET} />
			<span>Backup Wallet</span>
		</div>
	)
}

export default BackupButton
