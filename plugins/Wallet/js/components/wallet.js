import PropTypes from 'prop-types'
import React from 'react'
import SendButton from './sendbutton.js'
import SendPrompt from '../containers/sendprompt.js'
import ReceiveButton from '../containers/receivebutton.js'
import ReceivePrompt from '../containers/receiveprompt.js'
import LockButton from '../containers/lockbutton.js'
import RecoverButton from '../containers/recoverbutton.js'
import RecoveryDialog from '../containers/recoverydialog.js'
import ChangePasswordButton from '../containers/changepasswordbutton.js'
import ChangePasswordDialog from '../containers/changepassworddialog.js'
import BackupButton from '../containers/backupbutton.js'
import BackupPrompt from '../containers/backupprompt.js'
import BalanceInfo from '../containers/balanceinfo.js'
import LockScreen from '../containers/lockscreen.js'

const Wallet = ({
	loading,
	showBalanceInfo,
	showBackupPrompt,
	showReceivePrompt,
	showChangePasswordDialog,
	showSendPrompt,
	showRecoveryDialog,
	actions,
}) => {
	const onSendClick = (currencytype) => () =>
		actions.startSendPrompt(currencytype)
	return (
		<div className="wallet pure-g">
			<div id="sidebar" className="pure-u-1-5">
				<h1>Wallet</h1>
				<SendButton
					currencytype="spacecash"
					onClick={onSendClick('spacecash')}
				/>
				<ReceiveButton />
				<LockButton />
				<ChangePasswordButton />
				<RecoverButton />
				<BackupButton />
			</div>
			<div id="main-panel" className="pure-u-4-5">
				{loading ? null : <LockScreen />}
				{showBalanceInfo ? <BalanceInfo /> : null}
				{showSendPrompt ? <SendPrompt /> : null}
				{showReceivePrompt ? <ReceivePrompt /> : null}
				{showRecoveryDialog ? <RecoveryDialog /> : null}
				{showChangePasswordDialog ? <ChangePasswordDialog /> : null}
				{showBackupPrompt ? <BackupPrompt /> : null}
			</div>
		</div>
	)
}

Wallet.propTypes = {
	loading: PropTypes.bool,
	showSendPrompt: PropTypes.bool,
	showReceivePrompt: PropTypes.bool,
	showChangePasswordDialog: PropTypes.bool,
	showBackupPrompt: PropTypes.bool,
}

export default Wallet
