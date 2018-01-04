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
        return Object.assign({}, state, {
            lastFrameTime: performance.now()
        })
    }
}

export default function reducer (state = initialState, action) {
    const fn = actionsMap[action.type]
    return fn ? fn(state, action) : state
}
