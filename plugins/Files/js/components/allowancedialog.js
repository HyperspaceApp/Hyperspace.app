import PropTypes from 'prop-types'
import React from 'react'
import UnlockWarning from './unlockwarning.js'
import ConfirmationDialog from './allowanceconfirmation.js'
import BigNumber from 'bignumber.js'

const AllowanceDialog = ({confirming, confirmationAllowance, unlocked, synced, feeEstimate, storageEstimate, actions}) => {
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onConfirmationCancel = () => actions.hideAllowanceConfirmation()
	const onConfirmClick = () => actions.setAllowance(confirmationAllowance)
	const onAcceptClick = (e) => {
		e.preventDefault()
		actions.showAllowanceConfirmation(e.target.allowance.value)
	}
	const onAllowanceChange = (e) => actions.getStorageEstimate(e.target.value)
	const dialogContents = confirming ? (
		<ConfirmationDialog allowance={confirmationAllowance} onConfirmClick={onConfirmClick} onCancelClick={onConfirmationCancel} />
	) : (
		<div className="allowance-dialog">
			<h3> Buy storage on the Hyperspace Distributed Network</h3>
			<div className="allowance-message">
				<p>You need to allocate funds to upload and download on Hyperspace. Your allowance remains locked for 3 months. Unspent funds are then refunded*. You can increase your allowance at any time.</p>
				<p>Your storage allowance automatically refills every 6 weeks. Your computer must be online with your wallet unlocked to complete the refill. If Hyperspace fails to refill the allowance by the end of the lock-in period, your data may be lost.</p>
				<p className="footnote">*contract fees are non-refundable. They will be subtracted from the allowance that you set.</p>
			</div>
			<form onSubmit={onAcceptClick}>
				<div className="allowance-input">
					<label>Allowance: <input type="number" name="allowance" defaultValue="5000" onFocus={onAllowanceChange} onChange={onAllowanceChange} required autoFocus className="allowance-amount" /></label>
					<span> SPACE</span>
				</div>
				<div className="allowance-buttons">
					<button type="submit" className="allowance-button-accept">Accept</button>
					<button type="button" onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
				</div>
				<table className="estimates">
					<tr>
						<td className="estimate-label">Estimated Fees</td>
						<td className="estimate-content">{new BigNumber(feeEstimate).round(2).toString()} SPACE</td>
					</tr>
					<tr>
						<td className="estimate-label">Estimated Storage</td>
						<td className="estimate-content">{storageEstimate}</td>
					</tr>
				</table>
			</form>
		</div>
	)

	return (
		<div className="modal">
			{unlocked && synced ? dialogContents : <UnlockWarning onClick={onCancelClick} />}
		</div>
	)
}

AllowanceDialog.propTypes = {
	confirmationAllowance: PropTypes.string.isRequired,
	confirming: PropTypes.bool.isRequired,
	unlocked: PropTypes.bool.isRequired,
	synced: PropTypes.bool.isRequired,
	feeEstimate: PropTypes.number.isRequired,
	storageEstimate: PropTypes.string.isRequired,
}

export default AllowanceDialog
