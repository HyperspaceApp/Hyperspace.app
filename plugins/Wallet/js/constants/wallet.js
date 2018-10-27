import Path from 'path'

export const COMMON_SUCCESS_WHITE_ICON_PATH = Path.join(
	'assets',
	'common_success_white.svg'
)
export const WALLET_CREATE_ICON_PATH = Path.join(
	'assets',
	'wallet_start_create.svg'
)
export const WALLET_LOAD_ICON_PATH = Path.join(
	'assets',
	'wallet_start_load.svg'
)
export const WALLET_CHANGE_PASSWORD_ICON_PATH = Path.join(
	'assets',
	'wallet_change_password.svg'
)
export const WALLET_COPY_ADDRESS_ICON_PATH = Path.join(
	'assets',
	'wallet_copy_address.svg'
)
export const WALLET_LOCKED_ICON_PATH = Path.join('assets', 'wallet_locked.svg')
export const GET_LOCK_STATUS = 'GET_LOCK_STATUS'
export const SET_LOCKED = 'SET_LOCKED'
export const SET_UNLOCKED = 'SET_UNLOCKED'
export const SET_ENCRYPTED = 'SET_ENCRYPTED'
export const SET_UNENCRYPTED = 'SET_UNENCRYPTED'
export const CREATE_NEW_WALLET = 'CREATE_NEW_WALLET'
export const START_PASSWORD_PROMPT = 'START_PASSWORD_PROMPT'
export const CLOSE_PASSWORD_PROMPT = 'CLOSE_PASSWORD_PROMPT'
export const PASSWORD_PROMPT_FAILURE = 'PASSWORD_PROMPT_FAILURE'
export const PASSWORD_PROMPT_SUCCESS = 'PASSWORD_PROMPT_SUCCESS'
export const HANDLE_PASSWORD_CHANGE = 'HANDLE_PASSWORD_CHANGE'
export const SHOW_NEW_WALLET_DIALOG = 'SHOW_NEW_WALLET_DIALOG'
export const DISMISS_NEW_WALLET_DIALOG = 'DISMISS_NEW_WALLET_DIALOG'
export const LOCK_WALLET = 'LOCK_WALLET'
export const UNLOCK_WALLET = 'UNLOCK_WALLET'
export const GET_BALANCE = 'GET_BALANCE'
export const SET_BALANCE = 'SET_BALANCE'
export const GET_TRANSACTIONS = 'GET_TRANSACTIONS'
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS'
export const START_SEND_PROMPT = 'START_SEND_PROMPT'
export const CLOSE_SEND_PROMPT = 'CLOSE_SEND_PROMPT'
export const SET_SEND_AMOUNT = 'SET_SEND_AMOUNT'
export const SET_SEND_ADDRESS = 'SET_SEND_ADDRESS'
export const SEND_CURRENCY = 'SEND_CURRENCY'
export const SHOW_RECEIVE_PROMPT = 'SHOW_RECEIVE_PROMPT'
export const HIDE_RECEIVE_PROMPT = 'HIDE_RECEIVE_PROMPT'
export const SET_RECEIVE_ADDRESS = 'SET_RECEIVE_ADDRESS'
export const GET_NEW_RECEIVE_ADDRESS = 'GET_NEW_RECEIVE_ADDRESS'
export const GET_RECEIVE_ADDRESS = 'GET_RECEIVE_ADDRESS'
export const SHOW_CONFIRMATION_DIALOG = 'SHOW_CONFIRMATION_DIALOG'
export const HIDE_CONFIRMATION_DIALOG = 'HIDE_CONFIRMATION_DIALOG'
export const SHOW_MORE_TRANSACTIONS = 'SHOW_MORE_TRANSACTIONS'
export const SET_SYNCSTATE = 'SET_SYNCSTATE'
export const GET_SYNCSTATE = 'GET_SYNCSTATE'
export const SHOW_NEW_WALLET_FORM = 'SHOW_NEW_WALLET_FORM'
export const HIDE_NEW_WALLET_FORM = 'HIDE_NEW_WALLET_FORM'
export const SET_USE_CUSTOM_PASSPHRASE = 'SET_USE_CUSTOM_PASSPHRASE'
export const SHOW_SEED_RECOVERY_DIALOG = 'SHOW_SEED_RECOVERY_DIALOG'
export const HIDE_SEED_RECOVERY_DIALOG = 'HIDE_SEED_RECOVERY_DIALOG'
export const RECOVER_SEED = 'RECOVER_SEED'
export const SEED_RECOVERY_STARTED = 'SEED_RECOVERY_STARTED'
export const SEED_RECOVERY_FINISHED = 'SEED_RECOVERY_FINISHED'
export const SHOW_INIT_SEED_FORM = 'SHOW_INIT_SEED_FORM'
export const HIDE_INIT_SEED_FORM = 'HIDE_INIT_SEED_FORM'
export const SEED_INIT_STARTED = 'SEED_INIT_STARTED'
export const SEED_INIT_FINISHED = 'SEED_INIT_FINISHED'
export const SET_RESCANNING = 'SET_RESCANNING'
export const SET_CONFIRMATION_ERROR = 'SET_CONFIRMATION_ERROR'
export const SHOW_CHANGE_PASSWORD_DIALOG = 'SHOW_CHANGE_PASSWORD_DIALOG'
export const HIDE_CHANGE_PASSWORD_DIALOG = 'HIDE_CHANGE_PASSWORD_DIALOG'
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'
export const SET_CHANGE_PASSWORD_ERROR = 'SET_CHANGE_PASSWORD_ERROR'
export const TOGGLE_FILTER = 'TOGGLE_FILTER'
export const FETCH_DATA = 'FETCH_DATA'
export const SET_FEE_ESTIMATE = 'SET_FEE_ESTIMATE'
export const SET_PRIMARY_SEED = 'SET_PRIMARY_SEED'
export const SHOW_BACKUP_PROMPT = 'SHOW_BACKUP_PROMPT'
export const HIDE_BACKUP_PROMPT = 'HIDE_BACKUP_PROMPT'
export const SET_AUX_SEEDS = 'SET_AUX_SEEDS'
export const SET_SEND_ERROR = 'SET_SEND_ERROR'
export const SAVE_ADDRESS = 'SAVE_ADDRESS'
export const SET_RECEIVE_ADDRESSES = 'SET_RECEIVE_ADDRESSES'
export const SET_ADDRESS_DESCRIPTION = 'SET_ADDRESS_DESCRIPTION'
export const SHOW_BALANCE_INFO = 'SHOW_BALANCE_INFO'
export const HIDE_BALANCE_INFO = 'HIDE_BALANCE_INFO'
export const SET_LOADING = 'SET_LOADING'
export const SET_NOT_LOADING = 'SET_NOT_LOADING'
export const GET_LOADING_STATUS = 'GET_LOADING_STATUS'
export const COPY_TO_CLIPBOARD = 'COPY_TO_CLIPBOARD'

// panels
export const BALANCE_INFO_PANEL = 'BALANCE_INFO_PANEL'
export const SEND_PANEL = 'SEND_PANEL'
export const RECEIVE_PANEL = 'RECEIVE_PANEL'
export const NEW_WALLET_DIALOG_PANEL = 'NEW_WALLET_DIALOG_PANEL'
export const NEW_WALLET_FORM_PANEL = 'NEW_WALLET_FORM_PANEL'
export const CHANGE_PASSWORD_PANEL = 'CHANGE_PASSWORD_PANEL'
export const INIT_SEED_PANEL = 'INIT_SEED_PANEL'
export const BACKUP_PANEL = 'BACKUP_PANEL'
export const RECOVERY_PANEL = 'RECOVERY_PANEL'

// menu buttons
export const MENU_WALLET_SEND_SPACECASH = Path.join(
	'assets',
	'menu_wallet_send_spacecash.svg'
)
export const MENU_WALLET_RECEIVE_SPACECASH = Path.join(
	'assets',
	'menu_wallet_receive_spacecash.svg'
)
export const MENU_WALLET_LOCK_WALLET = Path.join(
	'assets',
	'menu_wallet_lock_wallet.svg'
)
export const MENU_WALLET_CHANGE_PASSWORD = Path.join(
	'assets',
	'menu_wallet_change_password.svg'
)
export const MENU_WALLET_RECOVER_SEED = Path.join(
	'assets',
	'menu_wallet_recover_seed.svg'
)
export const MENU_WALLET_BACKUP_WALLET = Path.join(
	'assets',
	'menu_wallet_backup_wallet.svg'
)
