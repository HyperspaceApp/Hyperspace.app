// Helper functions for the wallet plugin.  Mostly used in sagas.

import BigNumber from 'bignumber.js'
import { List } from 'immutable'
const uint64max = Math.pow(2, 64)

// hsdCall: promisify Hsd API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
export const hsdCall = (uri) => new Promise((resolve, reject) => {
	HyperspaceAPI.call(uri, (err, response) => {
		if (err) {
			reject(err)
		} else {
			resolve(response)
		}
	})
})

// Compute the sum of all currencies of type currency in txns
const sumCurrency = (txns, currency) => txns.reduce((sum, txn) => {
	if (txn.fundtype.indexOf(currency) > -1) {
		return sum.add(new BigNumber(txn.value))
	}
	return sum
}, new BigNumber(0))

// Compute the net value and currency type of a transaction.
const computeTransactionSum = (txn) => {
	let totalSiacoinInput = new BigNumber(0)
	let totalMinerInput = new BigNumber(0)

	let totalSiacoinOutput = new BigNumber(0)
	let totalMinerOutput = new BigNumber(0)

	if (txn.inputs) {
		const walletInputs = txn.inputs.filter((input) => input.walletaddress && input.value)
		totalSiacoinInput = sumCurrency(walletInputs, 'siacoin')
		totalMinerInput = sumCurrency(walletInputs, 'miner')
	}
	if (txn.outputs) {
		const walletOutputs = txn.outputs.filter((input) => input.walletaddress && input.value)
		totalSiacoinOutput = sumCurrency(walletOutputs, 'siacoin')
		totalMinerOutput = sumCurrency(walletOutputs, 'miner')
	}
	return {
		totalSiacoin: HyperspaceAPI.hastingsToSiacoins(totalSiacoinOutput.minus(totalSiacoinInput)),
		totalMiner:   HyperspaceAPI.hastingsToSiacoins(totalMinerOutput.minus(totalMinerInput)),
	}
}

// Parse data from /wallet/transactions and return a immutable List of transaction objects.
// The transaction objects contain the following values:
// {
//   confirmed (boolean): whether this transaction has been confirmed by the network
//	 transactionsums: the net siacoin and miner values
//   transactionid: The transaction ID
//   confirmationtimestamp:  The time at which this transaction occurred
// }
export const parseRawTransactions = (response) => {
	if (!response.unconfirmedtransactions) {
		response.unconfirmedtransactions = []
	}
	if (!response.confirmedtransactions) {
		response.confirmedtransactions = []
	}
	const rawTransactions = response.unconfirmedtransactions.concat(response.confirmedtransactions)
	const parsedTransactions = List(rawTransactions.map((txn) => {
		const transactionsums = computeTransactionSum(txn)
		const confirmed = (txn.confirmationtimestamp !== uint64max)
		return {
			confirmed,
			transactionsums,
			transactionid: txn.transactionid,
			confirmationtimestamp: new Date(txn.confirmationtimestamp*1000),
		}
	}))
	// Return the transactions, sorted by timestamp.
	return parsedTransactions.sortBy((txn) => -txn.confirmationtimestamp)
}
