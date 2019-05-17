import { combineReducers } from 'redux'
import config from './config'
import input from './input'
import ticker from './ticker'
import viewport from './viewport'

export default combineReducers({
    config,
    input,
    ticker,
    viewport
})
