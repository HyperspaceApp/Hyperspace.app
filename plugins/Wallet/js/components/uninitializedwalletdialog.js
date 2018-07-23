import PropTypes from 'prop-types'
import React from 'react'
import NewWalletForm from '../containers/newwalletform.js'
import InitSeedForm from './initseedform.js'
import { WALLET_CREATE_ICON_PATH, WALLET_LOAD_ICON_PATH } from '../constants/wallet.js'

const UninitializedWalletDialog = ({
	initializingSeed,
	useCustomPassphrase,
	showInitSeedForm,
	showNewWalletForm,
	actions,
}) => {
	if (showNewWalletForm && useCustomPassphrase) {
		return <NewWalletForm />
	}
	if (showInitSeedForm) {
		return (
			<InitSeedForm
				initializingSeed={initializingSeed}
				useCustomPassphrase={useCustomPassphrase}
				hideInitSeedForm={actions.hideInitSeedForm}
				createNewWallet={actions.createNewWallet}
			/>
		)
	}
	if (showNewWalletForm && !useCustomPassphrase) {
		actions.createNewWallet()
	}

	const handleCustomPasswordClick = () =>
		actions.setUseCustomPassphrase(!useCustomPassphrase)
	const handleCreateWalletClick = () => actions.showNewWalletForm()
	const handleCreateWalletFromSeedClick = () => actions.showInitSeedForm()

	return (
		<div className="uninitialized-wallet-dialog">
			<div className="wallet-init-buttons">
				<div onClick={handleCreateWalletClick} className="create-wallet-button">
					<img src={WALLET_CREATE_ICON_PATH} />
					<h3> Create a new wallet </h3>
				</div>
				<div className="create-wallet-button">
					<img
						src={WALLET_LOAD_ICON_PATH}
						onClick={handleCreateWalletFromSeedClick}
					/>
					<h3> Load a wallet from a seed </h3>
				</div>
			</div>
			<div className="use-passphrase-checkbox">
				<input
					type="checkbox"
					checked={useCustomPassphrase}
					onChange={handleCustomPasswordClick}
				/>
				<span> Use custom passphrase </span>
			</div>
		</div>
	)
}

UninitializedWalletDialog.propTypes = {
	useCustomPassphrase: PropTypes.bool.isRequired,
	showNewWalletForm: PropTypes.bool.isRequired,
	initializingSeed: PropTypes.bool.isRequired,
}

export default UninitializedWalletDialog
