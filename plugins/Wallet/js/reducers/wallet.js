import { Map, List } from 'immutable'
import * as constants from '../constants/wallet.js'
import { WALLET_UNLOCK_ERROR } from '../constants/error.js'

const initialState = Map({
	loading: true,
	synced: false,
	rescanning: false,
	unlocked: false,
	encrypted: false,
	unlocking: false,
	recovering: false,
	confirmedbalance: '0',
	unconfirmedbalance: '0',
	transactions: List(),
	ntransactions: 30,
	filter: true,
	showNewWalletDialog: false,
	showNewWalletForm: false,
	currentPanel: '',
	useCustomPassphrase: false,
	initializingSeed: false,
	changePasswordError: '',
	primarySeed: '',
	auxSeeds: [],
})

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
		case constants.SET_LOADING:
			return state.set('loading', true)
		case constants.SET_NOT_LOADING:
			return state.set('loading', false)
		case constants.GET_LOADING_STATUS:
			return state.get('loading')
		case constants.SHOW_BALANCE_INFO:
			return state.get('unlocked')
				? state.set('currentPanel', constants.BALANCE_INFO_PANEL)
				: state // lock screen empty <div/>
		case constants.HIDE_BALANCE_INFO:
			return state.set('currentPanel', '') // set to empty for lock screen
		case constants.SET_CHANGE_PASSWORD_ERROR:
			return state.set('changePasswordError', action.error)
		case constants.SHOW_CHANGE_PASSWORD_DIALOG:
			return state.get('unlocked')
				? state
						.set('currentPanel', constants.CHANGE_PASSWORD_PANEL)
						.set('changePasswordError', '')
				: state
		case constants.HIDE_CHANGE_PASSWORD_DIALOG:
			return state.set('currentPanel', constants.BALANCE_INFO_PANEL)
		case constants.SEED_RECOVERY_STARTED:
			return state.set('recovering', true)
		case constants.SEED_RECOVERY_FINISHED:
			return state.set('recovering', false)
		case constants.SHOW_NEW_WALLET_DIALOG:
			return state.get('unlocked')
				? state.set('showNewWalletDialog', true)
				: state
		case constants.DISMISS_NEW_WALLET_DIALOG:
			return state.set('showNewWalletDialog', false)
		case constants.SHOW_NEW_WALLET_FORM:
			return state.set('showNewWalletForm', true)
		case constants.HIDE_NEW_WALLET_FORM:
			return state.set('showNewWalletForm', false)
		case constants.SHOW_RECEIVE_PROMPT:
			return state.get('unlocked')
				? state.set('currentPanel', constants.RECEIVE_PANEL)
				: state
		case constants.HIDE_RECEIVE_PROMPT:
			return state.set('currentPanel', constants.BALANCE_INFO_PANEL)
		case constants.START_SEND_PROMPT:
			return state.get('unlocked')
				? state.set('currentPanel', constants.SEND_PANEL)
				: state
		case constants.CLOSE_SEND_PROMPT:
			return state.set('currentPanel', constants.BALANCE_INFO_PANEL)
		case constants.UNLOCK_WALLET:
			return state.set('unlocking', true)
		case WALLET_UNLOCK_ERROR:
			return state.set('unlocking', false)
		case constants.SET_LOCKED:
			return state.set('unlocked', false)
		case constants.SET_UNLOCKED:
			return state.set('unlocked', true).set('unlocking', false)
		case constants.SET_ENCRYPTED:
			return state.set('encrypted', true)
		case constants.SET_UNENCRYPTED:
			return state.set('encrypted', false)
		case constants.SET_SYNCSTATE:
			return state.set('synced', action.synced)
		case constants.SET_BALANCE:
			return state
				.set('confirmedbalance', action.confirmed)
				.set('unconfirmedbalance', action.unconfirmed)
		case constants.SHOW_MORE_TRANSACTIONS:
			return state.set(
				'ntransactions',
				state.get('ntransactions') + action.increment
			)
		case constants.SET_TRANSACTIONS:
			return state.set('transactions', action.transactions)
		case constants.SET_USE_CUSTOM_PASSPHRASE:
			return state.set('useCustomPassphrase', action.useCustomPassphrase)
		case constants.SHOW_SEED_RECOVERY_DIALOG:
			return state.get('unlocked')
				? state.set('currentPanel', constants.RECOVERY_PANEL)
				: state
		case constants.HIDE_SEED_RECOVERY_DIALOG:
			return state.set('currentPanel', constants.BALANCE_INFO_PANEL)
		case constants.SHOW_INIT_SEED_FORM:
			return state.set('showInitSeedForm', true)
		case constants.HIDE_INIT_SEED_FORM:
			return state.set('showInitSeedForm', false)
		case constants.SEED_INIT_STARTED:
			return state.set('initializingSeed', true)
		case constants.SEED_INIT_FINISHED:
			return state.set('initializingSeed', false)
		case constants.SET_RESCANNING: {
			let newstate = state.set('rescanning', action.rescanning)
			// the `rescanning` state is mutually exclusive with `recovering`,
			// `initializingSeed`, and `unlocking`. This makes sense for a user, they
			// will see 'recovering' or 'initializing' change to 'rescanning', an
			// accurate representation of what is happening on the backend.
			if (action.rescanning) {
				newstate = newstate
					.set('recovering', false)
					.set('initializingSeed', false)
					.set('unlocking', false)
					.set('showRecoveryDialog', false)
					.set('showInitSeedForm', false)
			}
			return newstate
		}
		case constants.TOGGLE_FILTER:
			return state.set('filter', !state.get('filter'))
		case constants.SHOW_BACKUP_PROMPT:
			return state.get('unlocked')
				? state.set('currentPanel', constants.BACKUP_PANEL)
				: state
		case constants.HIDE_BACKUP_PROMPT:
			return state
				.set('currentPanel', constants.BALANCE_INFO_PANEL)
				.set('primarySeed', '')
				.set('auxSeeds', [])
		case constants.SET_PRIMARY_SEED:
			return state.set('primarySeed', action.primarySeed)
		case constants.SET_AUX_SEEDS:
			return state.set('auxSeeds', action.seeds)
		default:
			return state
	}
}
