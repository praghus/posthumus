import {
    TICKER_STARTED,
    TIME_TICK
} from '../actions'

const initialState = {
    tickerStarted: false,
    interval: 1000 / 60,
    lastFrameTime: null
}

const actionsMap = {
    [TICKER_STARTED]: (state) => {
        return Object.assign({}, state, {
            tickerStarted: true,
            lastFrameTime: performance.now()
        })
    },
    [TIME_TICK]: (state) => {
        // const { lastFrameTime } = state
        // const newFrameTime = performance.now()
        // const fps = 1000 / (newFrameTime - lastFrameTime)
        return Object.assign({}, state, {
            lastFrameTime: performance.now() // newFrameTime,
            // interval: 1000 / fps
        })
    }
}

export default function reducer (state = initialState, action) {
    const fn = actionsMap[action.type]
    return fn ? fn(state, action) : state
}
