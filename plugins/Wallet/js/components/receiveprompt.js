import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'
import { WALLET_COPY_ADDRESS_ICON_PATH } from '../constants/wallet'

const ReceivePrompt = ({ addresses, address, description, actions }) => {
	const handleDismissClick = () => actions.hideReceivePrompt()
	const handleGenerateClick = () => {
		actions.getNewReceiveAddress()
		actions.setAddressDescription('')
	}
	const handleDescriptionChange = (e) =>
		actions.setAddressDescription(e.target.value)
	const handleSaveClick = () => {
		actions.setAddressDescription('')
		actions.getNewReceiveAddress()
		actions.saveAddress({ description: description, address: address })
	}
	const copyAddress = (str) => actions.copyText(str)
	return (
		<div className="receive-panel">
			<div className="receive-prompt">
				<div className="receive-title"> Receiving Address </div>
				<div className="receive-form">
					<div className="receive-form-item">
						<div className="receive-address">{address}</div>

						<div
							className="receive-address-copy"
							onClick={() => copyAddress(address)}
						>
							<img src={WALLET_COPY_ADDRESS_ICON_PATH} />
							<span>Copy</span>
						</div>
					</div>
					<div className="receive-form-item">
						<input
							className="address-description"
							placeholder="Description"
							onChange={handleDescriptionChange}
							value={description}
						/>
					</div>
				</div>
				<div className="receive-buttons">
					<button className="save-address-button" onClick={handleSaveClick}>
						Save
					</button>
					<button className="new-address-button" onClick={handleGenerateClick}>
						New
					</button>
					<button className="done-button" onClick={handleDismissClick}>
						Done
					</button>
				</div>
				<h3> Prior Addresses </h3>
				{addresses.size > 0 ? (
					<table className="pure-table address-table">
						<thead>
							<tr>
								<th>Description</th>
								<th>Address</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{addresses.reverse().map((oldAddress, key) => (
								<tr className="prior-address" key={key}>
									<td className="description">
										{oldAddress.description.length > 15
											? oldAddress.address.slice(0, 15) + '...'
											: oldAddress.description}
									</td>
									<td className="address">
										{oldAddress.address.slice(0, 15) + '...'}
									</td>
									<td
										className="copy"
										onClick={() => copyAddress(oldAddress.address)}
									>
										<img src={WALLET_COPY_ADDRESS_ICON_PATH} />
										<span>Copy</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p> No prior addresses </p>
				)}
			</div>
		</div>
	)
}
ReceivePrompt.propTypes = {
	addresses: PropTypes.instanceOf(List),
	address: PropTypes.string,
	description: PropTypes.string,
}
export default ReceivePrompt
