import { INPUTS } from '../lib/constants'
import {
    UPDATE_KEY_PRESSED,
    UPDATE_MOUSE_POS
} from '../actions'

const initialState = {
    mousePos: [0, 0],
    keyPressed: {
        [INPUTS.INPUT_FIRE]: false,
        [INPUTS.INPUT_LEFT]: false,
        [INPUTS.INPUT_RIGHT]: false,
        [INPUTS.INPUT_DOWN]: false,
        [INPUTS.INPUT_UP]: false
    }
}

const actionsMap = {
    [UPDATE_MOUSE_POS]: (state, action) => {
        return Object.assign({}, state, {
            mousePos: [action.x, action.y]
        })
    },
    [UPDATE_KEY_PRESSED]: (state, action) => {
        const { keyPressed } = state
        keyPressed[action.key] = action.pressed
        return Object.assign({}, state, {...{keyPressed}})
    }
}

export default function reducer (state = initialState, action) {
    const fn = actionsMap[action.type]
    return fn ? fn(state, action) : state
}
