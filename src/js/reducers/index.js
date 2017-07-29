import { calculateViewportSize } from '../lib/utils'
import {
    TICKER_STARTED,
    TIME_TICK,
    UPDATE_MOUSE_POS,
    RESIZE_SCREEN
} from '../actions'

const initialState = {
    width: window.innerWidth,
    height: window.innerHeight,
    tickerStarted: false,
    mousePos: [0, 0],
    multiplier: 0,
    lastFrameTime: null,
    viewport: calculateViewportSize(window.innerWidth, window.innerHeight)
}

const actionsMap = {
    [TICKER_STARTED]: (state) => {
        return Object.assign({}, state, {
            tickerStarted: true,
            lastFrameTime: new Date()
        })
    },
    [TIME_TICK]: (state) => {
        const { lastFrameTime } = state
        const newFrameTime = performance.now()
        const multiplier = (newFrameTime - lastFrameTime) / (1000 / 60)

        return Object.assign({}, state, {
            lastFrameTime: performance.now(),
            multiplier
        })
    },
    [UPDATE_MOUSE_POS]: (state, action) => {
        return Object.assign({}, state, {
            mousePos: [action.x, action.y]
        })
    },
    [RESIZE_SCREEN]: (state, action) => {
        return Object.assign({}, state, {
            width: action.width,
            height: action.height,
            viewport: calculateViewportSize(action.width, action.height)
        })
    }
}

export default function reducer (state = initialState, action) {
    const fn = actionsMap[action.type]
    return fn ? fn(state, action) : state
}
