import React from 'react'

const ReceiveButton = ({actions}) => {
	const handleReceiveButtonClick = () => actions.showReceivePrompt()
	return (
		<div className="wallet-button receive-button" onClick={handleReceiveButtonClick}>
			<i className="fa fa-download" />
			<span>Receive Space Cash</span>
		</div>
	)
}

export default ReceiveButton
