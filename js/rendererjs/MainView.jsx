import React from 'react'
import ds from '../theme'
import styled from 'styled-components'
import Sidebar from './containers/Sidebar'
import plugins from 'plugins'
import WebView from 'react-electron-web-view'
import path from 'path'
import { connect } from 'react-redux'

const isDev = !!__DEV__
class App extends React.Component {
  render () {
    const { navigation } = this.props
    const findPlugin = pluginName => {
      return plugins.find(o => o.name === pluginName)
    }
    const activePlugin = findPlugin(navigation.selectedPlugin)
    return (
      <AppWrap>
        <Sidebar />
        <WebviewWrap>
          <WebViewContainer
            src={activePlugin.src}
            devtools={isDev}
            nodeintegration
          />
        </WebviewWrap>
      </AppWrap>
    )
  }
}

function mapStateToProps (state) {
  return {
    navigation: state.navigation
  }
}

const AppWrap = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  background: ${ds.color('sky')};
  height: 100%;
  width: 100%;
`
const WebviewWrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const WebViewContainer = styled(WebView)`
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
`

export default connect(mapStateToProps)(App)
