import {
    Bat,
    Bullet,
    Coin,
    DarkMask,
    JumpThrough,
    Lava,
    LavaStone,
    Particle,
    Player,
    Slope,
    Spikes,
    Zombie
} from '../models/entities'

export const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
}

export const COLORS = {
    PLAYER_SHOOT: '#deeed6',
    PLAYER_LIGHT: 'rgba(150,150,200,0.3)'
}

export const LIGHTS = {
    PLAYER_LIGHT: 'player_light',
    SHOOT_LIGHT: 'shoot_light'
}

export const ENTITIES_TYPE = {
    BAT: 'bat',
    BULLET: 'bullet',
    COIN: 'coin',
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
    { type: ENTITIES_TYPE.DARK_MASK, family: ENTITIES_FAMILY.MODIFIERS, model: DarkMask },
    { type: ENTITIES_TYPE.JUMP_THROUGH, family: ENTITIES_FAMILY.MODIFIERS, model: JumpThrough },
    { type: ENTITIES_TYPE.LAVA, family: ENTITIES_FAMILY.TRAPS, model: Lava },
    { type: ENTITIES_TYPE.LAVA_STONE, family: ENTITIES_FAMILY.TRAPS, model: LavaStone },
    { type: ENTITIES_TYPE.PARTICLE, family: ENTITIES_FAMILY.PARTICLES, model: Particle },
    { type: ENTITIES_TYPE.PLAYER, model: Player},
    { type: ENTITIES_TYPE.SPIKES, family: ENTITIES_FAMILY.TRAPS, model: Spikes },
    { type: ENTITIES_TYPE.SLOPE_LEFT, family: ENTITIES_FAMILY.MODIFIER, model: Slope },
    { type: ENTITIES_TYPE.SLOPE_RIGHT, family: ENTITIES_FAMILY.MODIFIER, model: Slope },
    { type: ENTITIES_TYPE.ZOMBIE, family: ENTITIES_FAMILY.ENEMIES, model: Zombie }
]

export function getEntityByType (entityType) {
    return ENTITIES.filter(({ type }) => entityType === type)[0] || null
}
