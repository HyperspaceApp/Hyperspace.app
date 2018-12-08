import React from 'react'

const SetAllowanceButton = ({actions}) => {
	const handleClick = () => actions.showAllowanceDialog()
	return (
		<div onClick={handleClick} className="set-allowance-button">
			<button> Create Allowance </button>
		</div>
	)
}

export default SetAllowanceButton
