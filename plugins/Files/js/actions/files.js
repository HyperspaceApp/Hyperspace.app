import * as constants from '../constants/files.js'

export const getWalletLockstate = () => ({
	type: constants.GET_WALLET_LOCKSTATE,
})
export const receiveWalletLockstate = (unlocked) => ({
	type: constants.RECEIVE_WALLET_LOCKSTATE,
	unlocked,
})
export const getWalletSyncstate = () => ({
	type: constants.GET_WALLET_SYNCSTATE,
})
export const setWalletSyncstate = (synced) => ({
	type: constants.SET_WALLET_SYNCSTATE,
	synced,
})
export const getFiles = () => ({
	type: constants.GET_FILES,
})
export const receiveFiles = (files) => ({
	type: constants.RECEIVE_FILES,
	files,
})
export const getAllowance = () => ({
	type: constants.GET_ALLOWANCE,
})
export const receiveAllowance = (allowance) => ({
	type: constants.RECEIVE_ALLOWANCE,
	allowance,
})
export const receiveSpending = (downloadspending, uploadspending, storagespending, contractspending, unspent, renewheight) => ({
	type: constants.RECEIVE_SPENDING,
	downloadspending,
	uploadspending,
	storagespending,
	contractspending,
	unspent,
	renewheight,
})
export const getStorageEstimate = (funds) => ({
	type: constants.GET_STORAGE_ESTIMATE,
	funds,
})
export const setStorageEstimate = (estimate) => ({
	type: constants.SET_STORAGE_ESTIMATE,
	estimate,
})
export const setFeeEstimate = (estimate) => ({
	type: constants.SET_FEE_ESTIMATE,
	estimate,
})
export const setAllowanceCompleted = () => ({
	type: constants.SET_ALLOWANCE_COMPLETED,
})
export const setAllowance = (funds) => ({
	type: constants.SET_ALLOWANCE,
	funds,
})
export const getWalletBalance = () => ({
	type: constants.GET_WALLET_BALANCE,
})
export const receiveWalletBalance = (balance) => ({
	type: constants.RECEIVE_WALLET_BALANCE,
	balance,
})
export const showAllowanceDialog = () => ({
	type: constants.SHOW_ALLOWANCE_DIALOG,
})
export const closeAllowanceDialog = () => ({
	type: constants.CLOSE_ALLOWANCE_DIALOG,
})
export const setPath = (path) => ({
	type: constants.SET_PATH,
	path,
})
export const setSearchText = (text, path) => ({
	type: constants.SET_SEARCH_TEXT,
	text,
	path,
})
export const toggleSearchField = () => ({
	type: constants.TOGGLE_SEARCH_FIELD,
})
export const setDragging = () => ({
	type: constants.SET_DRAGGING,
})
export const setNotDragging = () => ({
	type: constants.SET_NOT_DRAGGING,
})
export const showUploadDialog = (source) => ({
	type: constants.SHOW_UPLOAD_DIALOG,
	source,
})
export const hideUploadDialog = () => ({
	type: constants.HIDE_UPLOAD_DIALOG,
})
export const downloadFile = (file, downloadpath) => ({
	type: constants.DOWNLOAD_FILE,
	file,
	downloadpath,
})
export const uploadFile = (hyperspacepath, source) => ({
	type: constants.UPLOAD_FILE,
	hyperspacepath,
	source,
})
export const deleteFile = (file) => ({
	type: constants.DELETE_FILE,
	file,
})
export const uploadFolder = (hyperspacepath, source) => ({
	type: constants.UPLOAD_FOLDER,
	hyperspacepath,
	source,
})
export const getDownloads = () => ({
	type: constants.GET_DOWNLOADS,
})
export const getUploads = () => ({
	type: constants.GET_UPLOADS,
})
export const receiveUploads = (uploads) => ({
	type: constants.RECEIVE_UPLOADS,
	uploads,
})
export const receiveDownloads = (downloads) => ({
	type: constants.RECEIVE_DOWNLOADS,
	downloads,
})
export const showFileTransfers = () => ({
	type: constants.SHOW_FILE_TRANSFERS,
})
export const hideFileTransfers = () => ({
	type: constants.HIDE_FILE_TRANSFERS,
})
export const toggleFileTransfers = () => ({
	type: constants.TOGGLE_FILE_TRANSFERS,
})
export const showDeleteDialog = (files) => ({
	type: constants.SHOW_DELETE_DIALOG,
	files,
})
export const hideDeleteDialog = () => ({
	type: constants.HIDE_DELETE_DIALOG,
})
export const getContractCount = () => ({
	type: constants.GET_CONTRACT_COUNT,
})
export const setContractCount = (count) => ({
	type: constants.SET_CONTRACT_COUNT,
	count,
})
export const renameFile = (file, newhyperspacepath) => ({
	type: constants.RENAME_FILE,
	file,
	newhyperspacepath,
})
export const showRenameDialog = (file) => ({
	type: constants.SHOW_RENAME_DIALOG,
	file,
})
export const hideRenameDialog = () => ({
	type: constants.HIDE_RENAME_DIALOG,
})
export const selectFile = (file) => ({
	type: constants.SELECT_FILE,
	file,
})
export const selectUpTo = (file) => ({
	type: constants.SELECT_UP_TO,
	file,
})
export const deselectAll = () => ({
	type: constants.DESELECT_ALL,
})
export const deselectFile = (file) => ({
	type: constants.DESELECT_FILE,
	file,
})
export const clearDownloads = () => ({
	type: constants.CLEAR_DOWNLOADS,
})
export const showAllowanceConfirmation = (allowance) => ({
	type: constants.SHOW_ALLOWANCE_CONFIRMATION,
	allowance,
})
export const hideAllowanceConfirmation = () => ({
	type: constants.HIDE_ALLOWANCE_CONFIRMATION,
})
export const fetchData = () => ({
	type: constants.FETCH_DATA,
})
export const addFolder = (name) => ({
	type: constants.ADD_FOLDER,
	name,
})
export const showAddFolderDialog = () => ({
	type: constants.SHOW_ADD_FOLDER_DIALOG,
})
export const hideAddFolderDialog = () => ({
	type: constants.HIDE_ADD_FOLDER_DIALOG,
})
export const setDragUploadEnabled = (enabled) => ({
	type: constants.SET_DRAG_UPLOAD_ENABLED,
	enabled,
})
export const setDragFolderTarget = (target) => ({
	type: constants.SET_DRAG_FOLDER_TARGET,
	target,
})
export const setDragFileOrigin = (origin) => ({
	type: constants.SET_DRAG_FILE_ORIGIN,
	origin,
})
export const renameHyperspaceAppFolder = (source, dest) => ({
	type: constants.RENAME_HYPERSPACE_APP_FOLDER,
	source,
	dest,
})
export const deleteHyperspaceAppFolder = (hyperspacepath) => ({
	type: constants.DELETE_HYPERSPACE_APP_FOLDER,
	hyperspacepath,
})
