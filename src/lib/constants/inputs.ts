export enum INPUTS {
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    LEFT = 'left',
    ACTION = 'action'
}

export const INPUT_KEYS = {
    [INPUTS.UP]: ['KeyW', 'ArrowUp'],
    [INPUTS.RIGHT]: ['KeyD', 'ArrowRight'],
    [INPUTS.DOWN]: ['KeyS', 'ArrowDown'],
    [INPUTS.LEFT]: ['KeyA', 'ArrowLeft'],
    [INPUTS.ACTION]: ['Space']
}
