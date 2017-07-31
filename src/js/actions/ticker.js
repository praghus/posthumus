export const TIME_TICK = 'TIME_TICK'
export const TICKER_STARTED = 'TICKER_STARTED'

export function tickTime () {
    return {
        type: TIME_TICK
    }
}

export function startTicker () {
    return {
        type: TICKER_STARTED
    }
}
