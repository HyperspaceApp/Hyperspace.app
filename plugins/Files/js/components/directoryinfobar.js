import PropTypes from 'prop-types'
import React from 'react'

const colorBackDisabled = '#C5C5C5'
const colorBackEnabled = '#00CBA0'

const DirectoryInfoBar = ({
	path,
	nfiles,
	onBackClick,
	setDragFolderTarget,
}) => {
	const backButtonStyle = {
		color: (() => {
			if (path === '') {
				return colorBackDisabled
			}
			return colorBackEnabled
		})(),
	}
	// handle file drag onto the info bar: move the file into the parent
	// directory
	const handleDragOver = () => {
		setDragFolderTarget('../')
	}
	return (
		<li onDragOver={handleDragOver} className="directory-infobar">
			<div className="directory-info">
				<span style={{ marginRight: '10px' }}>
					{' '}
				</span>
			</div>
		</li>
	)
}

DirectoryInfoBar.propTypes = {
	setDragFolderTarget: PropTypes.func.isRequired,
}

export default DirectoryInfoBar
