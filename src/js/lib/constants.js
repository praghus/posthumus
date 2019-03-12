export const JUMP_THROUGH_TILES = [
    87, 88, 210, 211, 212, 213, 214, 215, 243, 836,
    868, 1088, 1089, 917, 918, 1077, 1078
]
export const NON_COLLIDE_TILES = [
    // 1, 2, 6, 9, 7, 15, 16, 17, 18, 19,
    // 40, 42, 44, 47, 48, 49, 50, 51, 22, 38,
    // 39, 54, 58, 59, 60, 61, 69, 71, 79, 80,
    // 81, 119, 120, 90, 91, 92, 93, 97, 101, 110,
    // 111, 112, 115, 116, 121, 122, 125, 153, 129, 130,
    // 131, 132, 133, 140, 141, 142, 143, 144, 145, 146,
    // 147, 148, 149, 177, 178, 179, 180, 181, 182, 230,
    // 233, 234, 235, 245, 1045, 1046
]
export const MINI_TILES = {
    '230': {offsetX: 8, offsetY: 8, width: 8, height: 8},
    '233': {offsetX: 0, offsetY: 8, width: 8, height: 8},
    '234': {offsetX: 8, offsetY: 8, width: 8, height: 8},
    '235': {offsetX: 0, offsetY: 8, width: 8, height: 8}
}
export const SCENES = {
    INTRO: 'INTRO',
    GAME: 'GAME'
}
export const FONTS = {
    FONT_SMALL: { name: 'font_small', size: 5},
    FONT_NORMAL: { name: 'font_normal', size: 8},
    FONT_BIG: { name: 'font_big', size: 16}
}
export const COLORS = {
    BLUE_SKY: '#7CF',
    BLACK: '#000',
    DARK_GREY: '#222',
    DARK_RED: '#D00',
    GREEN: '#0F0',
    PURPLE: '#F0F',
    LIGHT_RED: '#F00',
    SPIDER_WEB: 'rgba(255,255,255,0.5)',
    TRANS_WHITE: 'rgba(255,255,255,0.1)'
}
export const LAYERS = {
    BACKGROUND: 1,
    MAIN: 2,
    OBJECTS: 3,
    FOREGROUND: 4
}
export const DIRECTIONS = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left'
}
export const INPUTS = {
    INPUT_UP: 'up',
    INPUT_RIGHT: 'right',
    INPUT_DOWN: 'down',
    INPUT_LEFT: 'left',
    INPUT_SHOT: 'shot',
    INPUT_MAP: 'map',
    INPUT_DEBUG: 'debug',
    INPUT_RESTORE: 'restore'
}
export const INPUT_KEYS = {
    [INPUTS.INPUT_UP]: ['KeyW', 'ArrowUp'],
    [INPUTS.INPUT_RIGHT]: ['KeyD', 'ArrowRight'],
    [INPUTS.INPUT_DOWN]: ['KeyS', 'ArrowDown'],
    [INPUTS.INPUT_LEFT]: ['KeyA', 'ArrowLeft'],
    [INPUTS.INPUT_SHOT]: ['Space'],
    [INPUTS.INPUT_MAP]: ['KeyM'],
    [INPUTS.INPUT_DEBUG]: ['KeyI'],
    [INPUTS.INPUT_RESTORE]: ['KeyL']
}
export const TIMEOUTS = {
    'MESSAGE': { name: 'message', duration: 3000 },
    'HINT': { name: 'hint', duration: 2000 },
    'PLAYER_HURT': { name: 'player_hurt', duration: 3000 },
    'PLAYER_MAP': { name: 'player_map', duration: 2000 },
    'PLAYER_RESPAWN': { name: 'player_respawn', duration: 1000 },
    'PLAYER_TAKE': { name: 'player_take', duration: 500 }
}
export const ASSETS = {
    BAT: 'bat',
    BULLET: 'bullet',
    SLIME: 'slime',
    CRUSHER: 'crusher',
    DUST: 'dust',
    ENERGY: 'energy',
    HEARTS: 'hearts',
    LAVA: 'lava',
    LIGHTING: 'lighting',
    PLAYER: 'player',
    ROCK: 'rock',
    SPIDER_TRAP: 'spider_trap',
    TORCH: 'torches',
    TILES: 'tiles'
}
