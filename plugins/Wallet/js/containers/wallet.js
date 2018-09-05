import WalletView from '../components/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startSendPrompt } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	loading: state.wallet.get('loading'),
	currentPanel: state.wallet.get('currentPanel'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ startSendPrompt }, dispatch),
})

const Wallet = connect(mapStateToProps, mapDispatchToProps)(WalletView)
export default Wallet
