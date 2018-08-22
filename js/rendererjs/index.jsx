import ReactDOM from 'react-dom'
import React from 'react'
// import { Provider, connect } from 'react-redux'
import MainView from './MainView'

// If dev enable window reload
if (process.env.NODE_ENV === 'development') {
  require('electron-css-reload')()
}

function renderApp (Component) {
  const main = document.getElementById('react-root')
  ReactDOM.render(
    // <Provider key={Math.random()}>
    <Component />,
    main
  )
}

renderApp(MainView)

if (module.hot) {
  const hotReload = () => {
    const refreshedComponent = require('./MainView')
    renderApp(refreshedComponent)
  }
  module.hot.accept('./MainView', hotReload)
}
