import PropTypes from 'prop-types'
import React from 'react'
import BigNumber from 'bignumber.js'

const SendPrompt = ({
	synced,
	confirmedbalance,
	currencytype,
	sendAddress,
	sendAmount,
	feeEstimate,
	sendError,
	actions,
}) => {
	const handleSendAddressChange = (e) => actions.setSendAddress(e.target.value)
	const handleSendAmountChange = (e) => actions.setSendAmount(e.target.value)
	const handleSendClick = () => {
		try {
			new BigNumber(sendAmount)
			actions.setSendError('')
			actions.sendCurrency(sendAddress, sendAmount, currencytype)
		} catch (e) {
			actions.setSendError('could not parse send amount')
		}
	}
	const handleCancelClick = () => actions.closeSendPrompt()
	return (
		<div className="send-panel">
			<div className="balance-header">
				<div className="balance-summary">
					<div className="confirmed-balance">{confirmedbalance}</div>
					<div className="confirmed-balance-text">Confirmed Balance</div>
				</div>
				{!synced ? (
					<div className="balance-not-synced">
						<i className="fa fa-exclamation-triangle" />
						<span className="balance-not-synced-message">
							Your wallet is not synced, balances are not final.
						</span>
					</div>
				) : null}
			</div>
			<div className="sendprompt">
				<div className="sendaddress">
					<div> Send To </div>
					<input
						className="sendto-input"
						onChange={handleSendAddressChange}
						placeholder="Address"
						value={sendAddress}
					/>
				</div>
				<div className="sendamount">
					<div> Amounts </div>
					<input
						className="amount-input"
						onChange={handleSendAmountChange}
						placeholder="SpaceCash"
						value={sendAmount}
					/>
				</div>
				<div className="fee-estimation">Estimated fee: {feeEstimate}</div>
				<span className="send-error">{sendError}</span>
				<div className="send-prompt-buttons">
					<button className="send-spacecash-button" onClick={handleSendClick}>
						Send
					</button>
					<button
						className="cancel-button cancel-send-button"
						onClick={handleCancelClick}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}
SendPrompt.propTypes = {
	synced: PropTypes.bool.isRequired,
	confirmedbalance: PropTypes.string.isRequired,
	sendAddress: PropTypes.string.isRequired,
	sendError: PropTypes.string.isRequired,
	sendAmount: PropTypes.string.isRequired,
	currencytype: PropTypes.string.isRequired,
	feeEstimate: PropTypes.string.isRequired,
}

export default SendPrompt
