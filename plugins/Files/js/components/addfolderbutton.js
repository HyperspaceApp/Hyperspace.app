import React from 'react'

const AddFolderButton = ({ actions }) => {
	const handleClick = () => actions.showAddFolderDialog()
	return (
		<div onClick={handleClick} className="addfolder-button">
			<button> New Folder </button>
		</div>
	)
}

export default AddFolderButton
