import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { select as d3Select } from 'd3'
import { soundsData } from './lib/sounds'
import { resizeScreen } from './actions'
import thunk from 'redux-thunk'
import soundsMiddleware from 'redux-sounds'
import rootReducer from './reducers'
import App from './views'

import 'babel-polyfill'
import '../scss/index.scss'

let store = null

const isProduction = process.env.NODE_ENV === 'production'
const loadedSoundsMiddleware = soundsMiddleware(soundsData)
const middleware = applyMiddleware(...[thunk, loadedSoundsMiddleware])

if (isProduction) {
    store = createStore(rootReducer, middleware)
}
else {
    let enhancer
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancer = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__())
    }
    else {
        enhancer = compose(middleware)
    }
    store = createStore(rootReducer, enhancer)
}

const onResize = function () {
    store.dispatch(resizeScreen(window.innerWidth, window.innerHeight))
}

ReactDOM.render(
    <Provider {...{store}}>
        <App />
    </Provider>,
    document.getElementById('root')
)

onResize()
d3Select(window).on('resize', onResize)
