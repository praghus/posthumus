export const TIME_TICK = 'TIME_TICK'
export const TICKER_STARTED = 'TICKER_STARTED'
export const UPDATE_MOUSE_POS = 'UPDATE_MOUSE_POS'
export const RESIZE_SCREEN = 'RESIZE_SCREEN'

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

export function updateMousePos (x, y) {
    return {
        type: UPDATE_MOUSE_POS,
        x: x,
        y: y
    }
}

export function resizeScreen (width, height) {
    return {
        type: RESIZE_SCREEN,
        width: width,
        height: height
    }
}
