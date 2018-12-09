import { Map, Set, OrderedSet, List } from 'immutable'
import * as constants from '../constants/files.js'
import { ls, searchFiles, allFiles, rangeSelect, buildTransferTimes, addTransferSpeeds } from '../sagas/helpers.js'
import Path from 'path'

const initialState = Map({
	files: List(),
	folders: List(),
	workingDirectoryFiles: null,
	searchResults: List(),
	uploading: List(),
	downloading: List(),
	selected: OrderedSet(),
	path: '',
	searchText: '',
	uploadSource: '',
	showAllowanceDialog: false,
	showAddFolderDialog: false,
	showUploadDialog: false,
	showSearchField: false,
	showAllFiles: true,
	showFileTransfers: false,
	showDeleteDialog: false,
	showRenameDialog: false,
	settingAllowance: false,
	dragging: false,
	dragUploadEnabled: true,
	dragFolderTarget: '',
	dragFileOrigin: {},
	contractCount: 0,
	allowance: 0,
	downloadspending: 0,
	uploadspending: 0,
	storagespending: 0,
	contractspending: 0,
	renewheight: 0,
	unspent: 0,
	showDownloadsSince: Date.now(),
	unreadUploads: Set(),
	unreadDownloads: Set(),
	downloadTimes: Map(),
})


export default function filesReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_DRAG_FILE_ORIGIN:
		return state.set('dragFileOrigin', action.origin)
	case constants.SET_DRAG_FOLDER_TARGET:
		return state.set('dragFolderTarget', action.target)
	case constants.SET_DRAG_UPLOAD_ENABLED:
		return state.set('dragUploadEnabled', action.enabled)
	case constants.SET_ALLOWANCE_COMPLETED:
		return state.set('settingAllowance', false)
	case constants.RECEIVE_ALLOWANCE:
		return state.set('allowance', action.allowance)
	case constants.RECEIVE_SPENDING:
		return state.set('downloadspending', action.downloadspending)
		            .set('uploadspending', action.uploadspending)
		            .set('storagespending', action.storagespending)
		            .set('contractspending', action.contractspending)
		            .set('unspent', action.unspent)
		            .set('renewheight', action.renewheight)
	case constants.DOWNLOAD_FILE:
		return state.set('unreadDownloads', state.get('unreadDownloads').add(action.file.hyperspacepath))
	case constants.UPLOAD_FILE:
		return state.set('unreadUploads', state.get('unreadUploads').add(action.hyperspacepath))
	case constants.RECEIVE_FILES: {
		const workingDirectoryFiles = ls(action.files.concat(state.get('folders')), state.get('path'))
		const workingDirectoryHyperspacepaths = workingDirectoryFiles.map((file) => file.hyperspacepath)
		// filter out selected files that are no longer in the working directory
		const selected = state.get('selected').filter((file) => workingDirectoryHyperspacepaths.includes(file.hyperspacepath))
		return state.set('files', action.files)
		            .set('workingDirectoryFiles', workingDirectoryFiles)
		            .set('selected', selected)
	}
	case constants.ADD_FOLDER: {
		const folder = {
			filesize: 0,
			hyperspacepath: Path.join(state.get('path'), action.name),
			available: false,
			redundancy: -1,
			uploadprogress: 100,
			hyperspaceAppFolder: true,
		}
		const folders = state.get('folders').push(folder)
		return state.set('folders', folders)
		            .set('workingDirectoryFiles', ls(state.get('files').concat(folders), state.get('path')), folders, state.get('path'))
	}
	case constants.DELETE_HYPERSPACE_APP_FOLDER: {
		return state.set('folders', state.get('folders').filter((folder) => {
			const cleanHyperspacepath = action.hyperspacepath.replace(/\/$/, '')
			const cleanSource = folder.hyperspacepath.replace(/\/$/, '')
			return cleanHyperspacepath !== cleanSource
		}))
	}
	case constants.RENAME_HYPERSPACE_APP_FOLDER:
		return state.set('folders', state.get('folders').map((folder) => {
			const cleanSource = action.source.replace(/\/$/, '')
			if (folder.hyperspacepath.indexOf(cleanSource) === 0) {
				folder.hyperspacepath = action.dest
			}
			return folder
		}))
	case constants.SET_ALLOWANCE:
		return state.set('allowance', action.funds)
		            .set('settingAllowance', true)
	case constants.CLEAR_DOWNLOADS:
		return state.set('showDownloadsSince', Date.now())
	case constants.SET_SEARCH_TEXT: {
		const results = searchFiles(allFiles(state), action.text, state.get('path'))
		return state.set('searchResults', results)
		            .set('searchText', action.text)
	}
	case constants.SET_PATH: {
		const workingDirFiles = ls(allFiles(state), action.path)
		return state.set('path', action.path)
		            .set('selected', OrderedSet())
		            .set('workingDirectoryFiles', workingDirFiles)
		            .set('searchResults', searchFiles(allFiles(state), state.get('searchText'), action.path))
	}
	case constants.DESELECT_FILE:
		return state.set('selected', state.get('selected').filter((file) => file.hyperspacepath !== action.file.hyperspacepath))
	case constants.SELECT_FILE:
		return state.set('selected', state.get('selected').add(action.file))
	case constants.DESELECT_ALL:
		return state.set('selected', OrderedSet())
	case constants.SELECT_UP_TO:
		return state.set('selected', rangeSelect(action.file, state.get('workingDirectoryFiles'), state.get('selected')))
	case constants.SHOW_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', true)
	case constants.CLOSE_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', false)
	case constants.TOGGLE_SEARCH_FIELD:
		return state.set('showSearchField', !state.get('showSearchField'))
	case constants.SET_DRAGGING:
		return state.set('dragging', true)
	case constants.SET_NOT_DRAGGING:
		return state.set('dragging', false)
	case constants.SHOW_DELETE_DIALOG:
		return state.set('showDeleteDialog', true)
	case constants.HIDE_DELETE_DIALOG:
		return state.set('showDeleteDialog', false)
	case constants.SHOW_UPLOAD_DIALOG:
		return state.set('showUploadDialog', true)
		            .set('uploadSource', action.source)
	case constants.HIDE_UPLOAD_DIALOG:
		return state.set('showUploadDialog', false)
	case constants.RECEIVE_UPLOADS:
		return state.set('uploading', action.uploads)
	case constants.RECEIVE_DOWNLOADS: {
		const untimedDownloads = action.downloads.filter((download) => Date.parse(download.starttime) > state.get('showDownloadsSince'))
		const previousDownloadTimes = state.get('downloadTimes')
		const downloadTimes = buildTransferTimes(previousDownloadTimes, untimedDownloads)
		const downloads = addTransferSpeeds(untimedDownloads, downloadTimes)
		return state.set('downloading', downloads)
			    .set('downloadTimes', downloadTimes)
	}
	case constants.SHOW_FILE_TRANSFERS:
		return state.set('showFileTransfers', true).set('showAllFiles', false)
	case constants.SHOW_ALL_FILES:
		return state.set('showFileTransfers', false).set('showAllFiles', true)
	case constants.TOGGLE_FILE_TRANSFERS:
		return state.set('showFileTransfers', !state.get('showFileTransfers'))
		            .set('unreadDownloads', Set())
		            .set('unreadUploads', Set())
	case constants.SET_CONTRACT_COUNT:
		return state.set('contractCount', action.count)
	case constants.SHOW_RENAME_DIALOG:
		return state.set('showRenameDialog', true)
	case constants.HIDE_RENAME_DIALOG:
		return state.set('showRenameDialog', false)
	case constants.SHOW_ADD_FOLDER_DIALOG:
		return state.set('showAddFolderDialog', true)
	case constants.HIDE_ADD_FOLDER_DIALOG:
		return state.set('showAddFolderDialog', false)
	default:
		return state
	}
}
