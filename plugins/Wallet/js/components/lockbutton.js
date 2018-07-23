import React from 'react'

const LockButton = ({actions}) => {
	const handleLockButtonClick = () => actions.lockWallet()
	return (
		<div className="wallet-button lock-button" onClick={handleLockButtonClick}>
			<i className="fa fa-lock" />
			<span>Lock Wallet</span>
		</div>
	)
}

export default LockButton
