export const TIME_TICK = 'TIME_TICK'
export const TICKER_STARTED = 'TICKER_STARTED'

export function tickTime (timestamp) {
    return {
        type: TIME_TICK,
        timestamp
    }
}

export function startTicker (timestamp) {
    return {
        type: TICKER_STARTED,
        timestamp
    }
}
