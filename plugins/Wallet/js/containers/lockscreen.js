import LockScreenView from '../components/lockscreen.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	showNewWalletDialog: state.wallet.get('showNewWalletDialog'),
	unlocked: state.wallet.get('unlocked'),
	unlocking: state.wallet.get('unlocking'),
	encrypted: state.wallet.get('encrypted'),
	rescanning: state.wallet.get('rescanning'),
})

const LockScreen = connect(mapStateToProps)(LockScreenView)
export default LockScreen
