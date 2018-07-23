import React from 'react'

const ChangePasswordButton = ({actions}) => {
	const handleChangePasswordClick = () => actions.showChangePasswordDialog()
	return (
		<div className="wallet-button change-password-button" onClick={handleChangePasswordClick}>
			<i className="fa fa-gear" />
			<span> Change Password</span>
		</div>
	)
}

export default ChangePasswordButton
