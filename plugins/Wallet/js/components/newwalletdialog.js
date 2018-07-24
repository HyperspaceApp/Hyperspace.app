import PropTypes from 'prop-types'
import React from 'react'
import ConfirmationDialog from '../containers/confirmationdialog.js'
import { COMMON_SUCCESS_WHITE_ICON_PATH } from '../constants/wallet.js'

const NewWalletDialog = ({
	password,
	seed,
	showConfirmationDialog,
	actions,
}) => {
	const handleDismissClick = () => actions.showConfirmationDialog()
	return (
		<div className="newwallet-dialog">
			{showConfirmationDialog ? <ConfirmationDialog /> : null}
			<p className="green-box success-message">
				<img src={COMMON_SUCCESS_WHITE_ICON_PATH} />
				<span className="success-text">
					You have created a new wallet! Please write down the seed and password
					in a safe place. If you forget your password, you won't be able to
					access your wallet.
				</span>
			</p>
			<h2> Seed: </h2>
			<span className="newwallet-seed">{seed}</span>
			<h2> Password: </h2>
			<span className="newwallet-password">{password}</span>
			<button className="newwallet-dismiss" onClick={handleDismissClick}>
				{' '}
				I have written these down in a safe place{' '}
			</button>
		</div>
	)
}

NewWalletDialog.propTypes = {
	password: PropTypes.string.isRequired,
	seed: PropTypes.string.isRequired,
}

export default NewWalletDialog
