import PropTypes from 'prop-types'
import React from 'react'
import { List, Set } from 'immutable'
import File from './file.js'
import Path from 'path'
import FileControls from '../containers/filecontrols.js'
import DirectoryInfoBar from './directoryinfobar.js'

const FileList = ({
	files,
	selected,
	searchResults,
	path,
	showSearchField,
	dragFileOrigin,
	dragFolderTarget,
	actions,
}) => {
	const onBackClick = () => {
		// remove a trailing slash if it exists
		const cleanPath = path.replace(/\/$/, '')

		if (cleanPath === '') {
			return
		}

		// find the parent directory and set the new path
		const pathComponents = cleanPath.split('/')
		if (pathComponents.length < 2) {
			actions.setPath('')
		} else {
			pathComponents.pop()
			actions.setPath(pathComponents.join('/'))
		}
	}

	if (files === null) {
		return (
			<div className="file-list">
				<ul>
					<h2> Loading files... </h2>
				</ul>
			</div>
		)
	}

	let filelistFiles
	if (showSearchField) {
		filelistFiles = searchResults
	} else {
		filelistFiles = files
	}
	const fileElements = filelistFiles.map((file, key) => {
		const isSelected = selected
			.map((selectedfile) => selectedfile.name)
			.includes(file.name)
		const onFileClick = (e) => {
			const shouldMultiSelect = e.ctrlKey || e.metaKey
			const shouldRangeSelect = e.shiftKey
			if (!shouldMultiSelect && !shouldRangeSelect) {
				actions.deselectAll()
			}
			if (shouldRangeSelect) {
				actions.selectUpTo(file)
			}
			if (shouldMultiSelect && isSelected) {
				actions.deselectFile(file)
			} else {
				actions.selectFile(file)
			}
		}
		const onDoubleClick = (e) => {
			e.stopPropagation()
			if (file.type === 'directory') {
				actions.setPath(file.hyperspacepath)
			}
		}
		const handleDragRename = () => {
			if (typeof dragFileOrigin === 'undefined' || dragFolderTarget === '') {
				return
			}
			if (dragFileOrigin.name === dragFolderTarget) {
				return
			}
			if (dragFolderTarget === '../' && path === '') {
				return
			}
			if (selected.size > 0) {
				selected.forEach((selectedfile) => {
					const destHyperspacePath = Path.posix.join(
						path,
						dragFolderTarget,
						selectedfile.name
					)
					actions.renameFile(selectedfile, destHyperspacePath)
					if (
						selected.type === 'directory' &&
						!selected.isHyperspaceAppFolder
					) {
						actions.deleteHyperspaceAppFolder(sourceHyperspacePath)
					}
				})
			} else {
				const sourceHyperspacePath = Path.posix.join(path, dragFileOrigin.name)
				const destHyperspacePath = Path.posix.join(
					path,
					dragFolderTarget,
					dragFileOrigin.name
				)
				actions.renameFile(
					{
						type: dragFileOrigin.type,
						hyperspacepath: sourceHyperspacePath,
						isHyperspaceAppFolder: dragFileOrigin.isHyperspaceAppFolder,
					},
					destHyperspacePath
				)
				if (
					dragFileOrigin.type === 'directory' &&
					!dragFileOrigin.isHyperspaceAppFolder
				) {
					actions.deleteHyperspaceAppFolder(sourceHyperspacePath)
				}
			}
			actions.getFiles()
			actions.setDragFolderTarget('')
			actions.setDragFileOrigin({})
		}
		return (
			<File
				key={key}
				selected={isSelected}
				isDragTarget={dragFolderTarget === file.name}
				isHyperspaceAppFolder={file.hyperspaceAppFolder}
				filename={file.name}
				filesize={file.size}
				redundancy={file.redundancy}
				uploadprogress={file.uploadprogress}
				available={file.available}
				onDoubleClick={onDoubleClick}
				type={file.type}
				onClick={onFileClick}
				setDragUploadEnabled={actions.setDragUploadEnabled}
				setDragFolderTarget={actions.setDragFolderTarget}
				setDragFileOrigin={actions.setDragFileOrigin}
				handleDragRename={handleDragRename}
			/>
		)
	})

	return (
		<div className="file-list">
			<ul>
				<DirectoryInfoBar setDragFolderTarget={actions.setDragFolderTarget} />
				{fileElements.size > 0 ? fileElements : <h2> No files uploaded </h2>}
			</ul>
			{selected.size > 0 ? <FileControls /> : null}
		</div>
	)
}

FileList.propTypes = {
	files: PropTypes.instanceOf(List),
	selected: PropTypes.instanceOf(Set).isRequired,
	searchResults: PropTypes.instanceOf(List),
	path: PropTypes.string.isRequired,
	showSearchField: PropTypes.bool.isRequired,
	dragFileOrigin: PropTypes.object.isRequired,
	dragFolderTarget: PropTypes.string.isRequired,
}

export default FileList
