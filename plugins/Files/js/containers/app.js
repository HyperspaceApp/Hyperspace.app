import AppView from '../components/app.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	showAllowanceDialog: state.files.get('showAllowanceDialog'),
	showAllFiles: state.files.get('showAllFiles'),
	showFileTransfers: state.files.get('showFileTransfers'),
})

const App = connect(mapStateToProps)(AppView)
export default App
