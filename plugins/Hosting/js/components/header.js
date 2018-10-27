import React from 'react'
import BigNumber from 'bignumber.js'
import WarningBar from './warningbar.js'
import HostStatus from './hoststatus.js'

const Header = ({
	numContracts,
	earned,
	expected,
	walletsize,
	walletLocked,
	workingstatus,
	connectabilitystatus,
}) => (
	<header className="header">
		<div className="title">Hosting</div>
		<div className="capsule">
			<div className="pod">
				<HostStatus
					workingstatus={workingstatus}
					connectabilitystatus={connectabilitystatus}
				/>
			</div>
			<div className="pod" id="contacts">
				{numContracts} active contracts
			</div>
			<div className="pod" id="money">
				{earned} XSC earned
			</div>
			<div className="pod" id="expected">
				{expected} XSC expected
			</div>
		</div>
		{new BigNumber(walletsize).lessThan('2000') && !walletLocked ? (
			<WarningBar
				title="Wallet balance too low."
				message="You must have at least 2,000 XSC to host files."
			/>
		) : null}
	</header>
)

export default Header
