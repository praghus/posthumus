import { INPUTS } from '../lib/constants'
import {
    UPDATE_KEY_PRESSED,
    UPDATE_MOUSE_POS
} from '../actions'

const initialState = {
    mousePos: [0, 0],
    keyPressed: {
        [INPUTS.INPUT_ACTION]: false,
        [INPUTS.INPUT_LEFT]: false,
        [INPUTS.INPUT_RIGHT]: false,
        [INPUTS.INPUT_DOWN]: false,
        [INPUTS.INPUT_UP]: false,
        [INPUTS.INPUT_DEBUG]: false
    }
}

const actionsMap = {
    [UPDATE_MOUSE_POS]: (state, action) => {
        return {
            ...state,
            mousePos: [
                action.x,
                action.y
            ]
        }
    },
    [UPDATE_KEY_PRESSED]: (state, action) => {
        const { keyPressed } = state
        keyPressed[action.key] = action.pressed
        return {
            ...state,
            keyPressed
        }
    }
}

export default function reducer (state = initialState, action) {
    const fn = actionsMap[action.type]
    return fn ? fn(state, action) : state
}
