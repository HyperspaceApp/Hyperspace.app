import React from 'react'
import PropTypes from 'prop-types'
import TransactionList from '../containers/transactionlist.js'

const BalanceInfo = ({synced, confirmedbalance, unconfirmedbalance}) => (
	<div className="balance-info">
		<span>Confirmed Balance: {confirmedbalance} SPACE </span>
		<span>Unconfirmed Delta: {unconfirmedbalance} SPACE </span>
		{!synced ? (
			<span style={{marginRight: '40px', color: 'rgb(255, 93, 93)'}} className="fa fa-exclamation-triangle">Your wallet is not synced, balances are not final.</span>
		) : null
		}
		<TransactionList />
	</div>
)
BalanceInfo.propTypes = {
	synced: PropTypes.bool.isRequired,
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired,
}
export default BalanceInfo

