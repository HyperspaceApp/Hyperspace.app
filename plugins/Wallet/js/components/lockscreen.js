import PropTypes from 'prop-types'
import React from 'react'
import PasswordPrompt from '../containers/passwordprompt.js'
import UninitializedWalletDialog from '../containers/uninitializedwalletdialog.js'
import RescanDialog from './rescandialog.js'
import NewWalletDialog from '../containers/newwalletdialog.js'

const LockScreen = ({ showNewWalletDialog, unlocked, unlocking, encrypted, rescanning }) => {
	if (unlocked && encrypted && !unlocking && !rescanning) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return <div />
	}
	let lockscreenContents
	if (showNewWalletDialog) {
		// lockscreen centers vertically, but we don't want to center vertically
		// I'm not sure this should all be rendered under a LockScreen component
		// but don't have a better design right now
		return <NewWalletDialog />
	} else if (!unlocked && encrypted && !rescanning) {
		lockscreenContents = <PasswordPrompt />
	} else if (rescanning) {
		lockscreenContents = <RescanDialog />
	} else if (!encrypted) {
		// Wallet is not encrypted, return a lockScreen that initializes a new wallet.
		lockscreenContents = <UninitializedWalletDialog />
	}
	return <div className="lockscreen">{lockscreenContents}</div>
}
LockScreen.propTypes = {
	showNewWalletDialog: PropTypes.bool.isRequired,
	unlocked: PropTypes.bool.isRequired,
	unlocking: PropTypes.bool.isRequired,
	encrypted: PropTypes.bool.isRequired,
	rescanning: PropTypes.bool.isRequired,
}

export default LockScreen
