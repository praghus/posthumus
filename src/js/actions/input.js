export const UPDATE_MOUSE_POS = 'UPDATE_MOUSE_POS'
export const UPDATE_KEY_PRESSED = 'UPDATE_KEY_PRESSED'

export function updateMousePos (x, y) {
    return {
        type: UPDATE_MOUSE_POS,
        ...{x, y}
    }
}

export function updateKeyPressed (key, pressed) {
    return {
        type: UPDATE_KEY_PRESSED,
        ...{key, pressed}
    }
}
