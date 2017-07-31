import { calculateViewportSize } from '../lib/utils'
import {
    RESIZE_SCREEN
} from '../actions'

const initialState = calculateViewportSize(window.innerWidth, window.innerHeight)

const actionsMap = {
    [RESIZE_SCREEN]: (state, action) => {
        return Object.assign({}, state, {
            ...calculateViewportSize(action.width, action.height)
        })
    }
}

export default function reducer (state = initialState, action) {
    const fn = actionsMap[action.type]
    return fn ? fn(state, action) : state
}
