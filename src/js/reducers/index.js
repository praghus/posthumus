import { combineReducers } from 'redux'
import input from './input'
import ticker from './ticker'
import viewport from './viewport'

export default combineReducers({
    input,
    ticker,
    viewport
})
