import PropTypes from 'prop-types'
import React from 'react'
import * as constants from '../constants/wallet.js'
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

const Wallet = ({ loading, currentPanel, actions }) => {
	const onSendClick = (currencytype) => () =>
		actions.startSendPrompt(currencytype)
	return (
		<div className="wallet">
			<div id="sidebar">
				<h1>Wallet</h1>
				<SendButton
					onClick={onSendClick('spacecash')}
					selected={constants.SEND_PANEL == currentPanel}
				/>
				<ReceiveButton selected={constants.RECEIVE_PANEL == currentPanel} />
				<LockButton />
				<ChangePasswordButton
					selected={constants.CHANGE_PASSWORD_PANEL == currentPanel}
				/>
				<RecoverButton selected={constants.RECOVERY_PANEL == currentPanel} />
				<BackupButton selected={constants.BACKUP_PANEL == currentPanel} />
			</div>
			<div id="main-panel">
				{loading ? null : <LockScreen />}
				{constants.BALANCE_INFO_PANEL == currentPanel ? <BalanceInfo /> : null}
				{constants.SEND_PANEL == currentPanel ? <SendPrompt /> : null}
				{constants.RECEIVE_PANEL == currentPanel ? <ReceivePrompt /> : null}
				{constants.RECOVERY_PANEL == currentPanel ? <RecoveryDialog /> : null}
				{constants.CHANGE_PASSWORD_PANEL == currentPanel ? (
					<ChangePasswordDialog />
				) : null}
				{constants.BACKUP_PANEL == currentPanel ? <BackupPrompt /> : null}
			</div>
		</div>
	)
}

Wallet.propTypes = {
	loading: PropTypes.bool,
	currentPanel: PropTypes.string,
}

export default Wallet
