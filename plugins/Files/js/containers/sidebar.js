import SideBarView from '../components/sidebar.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAllFiles, showFileTransfers } from '../actions/files.js'

const mapStateToProps = (state) => ({
	// unread: state.files.get('unreadUploads').size + state.files.get('unreadDownloads').size,
	contractCount: state.files.get('contractCount'),
	unspent: state.files.get('unspent'),
	renewheight: state.files.get('renewheight'),
	showAllFiles: state.files.get('showAllFiles'),
	showFileTransfers: state.files.get('showFileTransfers'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showAllFiles, showFileTransfers }, dispatch),
})

const SideBar = connect(mapStateToProps, mapDispatchToProps)(SideBarView)
export default SideBar
