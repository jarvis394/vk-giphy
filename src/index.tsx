import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from 'src/components/App'
import store from './store'
import * as serviceWorker from 'src/sw/serviceWorker'
import serviceWorkerConfig from 'src/sw/serviceWorkerConfig'
import 'src/styles/index.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
serviceWorker.register(serviceWorkerConfig)

