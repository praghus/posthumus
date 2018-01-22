import {
    Bat, Bullet, Coin, Crusher, DarkMask, JumpThrough, Lava,
    LavaStone, Particle, Player, Slope, Spider, SpiderBullet,
    SpiderTrap, SpiderWeb, Spikes, Zombie
} from '../models/entities'

export const COLORS = {
    PLAYER_SHOOT: '#deeed6',
    PLAYER_LIGHT: 'rgba(150,150,200,0.3)'
}

export const FONTS = {
    FONT_SMALL: { name: 'font_small', size: 5},
    FONT_NORMAL: { name: 'font_normal', size: 8},
    FONT_BIG: { name: 'font_big', size: 16}
}

export const LIGHTS = {
    PLAYER_LIGHT: 'player_light',
    SHOOT_LIGHT: 'shoot_light'
}

export const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}

export const INPUTS = {
    INPUT_UP: 'up',
    INPUT_RIGHT: 'right',
    INPUT_DOWN: 'down',
    INPUT_LEFT: 'left',
    INPUT_FIRE: 'fire'
}

export const INPUT_KEYS = {
    [INPUTS.INPUT_UP]: ['KeyW', 'ArrowUp'],
    [INPUTS.INPUT_RIGHT]: ['KeyD', 'ArrowRight'],
    [INPUTS.INPUT_DOWN]: ['KeyS', 'ArrowDown'],
    [INPUTS.INPUT_LEFT]: ['KeyA', 'ArrowLeft'],
    [INPUTS.INPUT_FIRE]: ['Space']
}

export const ENTITIES_TYPE = {
    BAT: 'bat',
    BULLET: 'bullet',
    COIN: 'coin',
    CRUSHER: 'crusher',
    DARK_MASK: 'dark_mask',
    EVIL_EYE: 'evil_eye',
    JUMP_THROUGH: 'jump_through',
    LAVA: 'lava',
    LAVA_STONE: 'lava_stone',
    PARTICLE: 'particle',
    PLAYER: 'player',
    SLOPE_LEFT: 'slope_left',
    SLOPE_RIGHT: 'slope_right',
    SPIDER: 'spider',
    SPIDER_BULLET: 'spider_bullet',
    SPIDER_TRAP: 'spider_trap',
    SPIDER_WEB: 'spider_web',
    SPIKES: 'spikes',
    TANK: 'tank',
    WOLF: 'wolf',
    ZOMBIE: 'zombie'
}

export const ENTITIES_FAMILY = {
    BULLETS: 'bullets',
    ENEMIES: 'enemies',
    ITEMS: 'items',
    MODIFIERS: 'modifiers',
    PARTICLES: 'particles',
    TRAPS: 'traps'
}

export const ENTITIES = [
    { type: ENTITIES_TYPE.BAT, family: ENTITIES_FAMILY.ENEMIES, model: Bat },
    { type: ENTITIES_TYPE.BULLET, family: ENTITIES_FAMILY.BULLETS, model: Bullet },
    { type: ENTITIES_TYPE.COIN, family: ENTITIES_FAMILY.ITEMS, model: Coin },
    { type: ENTITIES_TYPE.CRUSHER, family: ENTITIES_FAMILY.TRAPS, model: Crusher },
    { type: ENTITIES_TYPE.DARK_MASK, family: ENTITIES_FAMILY.MODIFIERS, model: DarkMask },
    { type: ENTITIES_TYPE.JUMP_THROUGH, family: ENTITIES_FAMILY.MODIFIERS, model: JumpThrough },
    { type: ENTITIES_TYPE.LAVA, family: ENTITIES_FAMILY.TRAPS, model: Lava },
    { type: ENTITIES_TYPE.LAVA_STONE, family: ENTITIES_FAMILY.TRAPS, model: LavaStone },
    { type: ENTITIES_TYPE.PARTICLE, family: ENTITIES_FAMILY.PARTICLES, model: Particle },
    { type: ENTITIES_TYPE.PLAYER, model: Player},
    { type: ENTITIES_TYPE.SPIDER, family: ENTITIES_FAMILY.ENEMIES, model: Spider },
    { type: ENTITIES_TYPE.SPIDER_BULLET, family: ENTITIES_FAMILY.BULLETS, model: SpiderBullet },
    { type: ENTITIES_TYPE.SPIDER_TRAP, family: ENTITIES_FAMILY.TRAPS, model: SpiderTrap },
    { type: ENTITIES_TYPE.SPIDER_WEB, family: ENTITIES_FAMILY.MODIFIER, model: SpiderWeb },
    { type: ENTITIES_TYPE.SPIKES, family: ENTITIES_FAMILY.TRAPS, model: Spikes },
    { type: ENTITIES_TYPE.SLOPE_LEFT, family: ENTITIES_FAMILY.MODIFIER, model: Slope },
    { type: ENTITIES_TYPE.SLOPE_RIGHT, family: ENTITIES_FAMILY.MODIFIER, model: Slope },
    { type: ENTITIES_TYPE.ZOMBIE, family: ENTITIES_FAMILY.ENEMIES, model: Zombie }
]

export function getEntityByType (entityType) {
    return ENTITIES.filter(({ type }) => entityType === type)[0] || null
}

export function getKeyPressed (key) {
    return Object.keys(INPUT_KEYS).find((input) => INPUT_KEYS[input].indexOf(key) !== -1)
}
