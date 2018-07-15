/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import Wallet from '../../plugins/Wallet/js/components/wallet.js'
import ReceiveButton from '../../plugins/Wallet/js/containers/receivebutton.js'
import ReceivePrompt from '../../plugins/Wallet/js/containers/receiveprompt.js'
import NewWalletDialog from '../../plugins/Wallet/js/containers/newwalletdialog.js'
import TransactionList from '../../plugins/Wallet/js/containers/transactionlist.js'
import SendPrompt from '../../plugins/Wallet/js/containers/sendprompt.js'

const testActions = {
	startSendPrompt: spy(),
}

describe('wallet component', () => {
	afterEach(() => {
		testActions.startSendPrompt.reset()
	})
	it('renders start send prompt with spacecash when send spacecash button is clicked', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		walletComponent.find('SendButton').first().simulate('click')
		expect(testActions.startSendPrompt.calledWith('spacecash')).to.be.true
	})
	it('renders a transaction list', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<TransactionList />)).to.be.true
	})
	it('renders a receive button', () => {
		const walletComponent = shallow(<Wallet synced confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<ReceiveButton />)).to.be.true
	})
	it('does not render show new wallet dialog unless showNewWalletDialog', () => {
		const walletComponent = shallow(<Wallet synced showNewWalletDialog={false} confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<NewWalletDialog />)).to.be.false
	})
	it('renders show new wallet dialog when showNewWalletDialog', () => {
		const walletComponent = shallow(<Wallet synced showNewWalletDialog confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<NewWalletDialog />)).to.be.true
	})
	it('does not render show send prompt unless showSendPrompt', () => {
		const walletComponent = shallow(<Wallet synced showSendPrompt={false} confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<SendPrompt />)).to.be.false
	})
	it('renders show send prompt when showSendPrompt', () => {
		const walletComponent = shallow(<Wallet synced showSendPrompt confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<SendPrompt />)).to.be.true
	})
	it('does not render show receive prompt unless showReceivePrompt', () => {
		const walletComponent = shallow(<Wallet synced showReceivePrompt={false} confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<ReceivePrompt />)).to.be.false
	})
	it('renders show receive prompt when showReceivePrompt', () => {
		const walletComponent = shallow(<Wallet synced showReceivePrompt confirmedbalance="10" unconfirmedbalance="1" actions={testActions} />)
		expect(walletComponent.contains(<ReceivePrompt />)).to.be.true
	})
})
/* eslint-enable no-unused-expressions */
