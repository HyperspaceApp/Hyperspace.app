import React from 'react'

const BackupButton = ({actions}) => {
	const handleClick = () => actions.showBackupPrompt()
	return (
		<div onClick={handleClick} className="wallet-button backup-button">
			<i className="fa fa-sticky-note" />
			<span>Backup Wallet</span>
		</div>
	)
}

export default BackupButton
