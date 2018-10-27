import React from 'react'
import PropTypes from 'prop-types'
import TransactionList from '../containers/transactionlist.js'

const BalanceInfo = ({ synced, confirmedbalance, unconfirmedbalance }) => (
	<div className="balance-info">
		<div className="balance-header">
			<div className="balance-summary">
				<div className="confirmed-balance">
					Confirmed Balance: {confirmedbalance} XSC{' '}
				</div>
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
		<TransactionList />
	</div>
)
BalanceInfo.propTypes = {
	synced: PropTypes.bool.isRequired,
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired,
}
export default BalanceInfo
