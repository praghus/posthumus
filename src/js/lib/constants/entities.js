import { ASSETS } from './assets'
import {
    Bat,
    Bullet,
    DarkMask,
    Item,
    Particle,
    Player,
    Slope,
    Spider,
    SpiderBullet,
    SpiderTrap,
    SpiderWeb,
    Spikes,
    Zombie
} from '../entities'

export const ENTITIES_FAMILY = {
    BULLETS: 'bullets',
    ENEMIES: 'enemies',
    ITEMS: 'items',
    MODIFIERS: 'modifiers',
    PARTICLES: 'particles',
    TRAPS: 'traps'
}

export const ENTITIES_TYPE = {
    BAT: 'bat',
    BULLET: 'bullet',
    DARK_MASK: 'dark_mask',
    ITEM: 'item',
    JUMP_THROUGH: 'jump_through',
    PARTICLE: 'particle',
    PLAYER: 'player',
    SLOPE: 'slope',
    SPIDER: 'spider',
    SPIDER_BULLET: 'spider_bullet',
    SPIDER_TRAP: 'spider_trap',
    SPIDER_WEB: 'spider_web',
    SPIKES: 'spikes',
    ZOMBIE: 'zombie'
}
/* eslint-disable max-len */
export const ENTITIES = [
    { type: ENTITIES_TYPE.PLAYER, model: Player, asset: ASSETS.PLAYER },
    { type: ENTITIES_TYPE.BULLET, family: ENTITIES_FAMILY.BULLETS, model: Bullet, asset: ASSETS.BULLET },
    { type: ENTITIES_TYPE.BAT, family: ENTITIES_FAMILY.ENEMIES, model: Bat, asset: ASSETS.BAT },
    { type: ENTITIES_TYPE.DARK_MASK, family: ENTITIES_FAMILY.MODIFIERS, model: DarkMask },
    { type: ENTITIES_TYPE.ITEM, family: ENTITIES_FAMILY.ITEMS, model: Item, asset: ASSETS.ITEM },
    { type: ENTITIES_TYPE.PARTICLE, family: ENTITIES_FAMILY.PARTICLES, model: Particle },
    { type: ENTITIES_TYPE.SLOPE, family: ENTITIES_FAMILY.MODIFIERS, model: Slope },
    { type: ENTITIES_TYPE.SPIDER, family: ENTITIES_FAMILY.ENEMIES, model: Spider, asset: ASSETS.SPIDER },
    { type: ENTITIES_TYPE.SPIDER_BULLET, family: ENTITIES_FAMILY.BULLETS, model: SpiderBullet, asset: ASSETS.SPIDER_BULLET },
    { type: ENTITIES_TYPE.SPIDER_TRAP, family: ENTITIES_FAMILY.ENEMIES, model: SpiderTrap, asset: ASSETS.SPIDER_TRAP },
    { type: ENTITIES_TYPE.SPIDER_WEB, family: ENTITIES_FAMILY.TRAPS, model: SpiderWeb, asset: ASSETS.SPIDER_WEB },
    { type: ENTITIES_TYPE.SPIKES, family: ENTITIES_FAMILY.TRAPS, model: Spikes },
    { type: ENTITIES_TYPE.ZOMBIE, family: ENTITIES_FAMILY.ENEMIES, model: Zombie, asset: ASSETS.ZOMBIE }
]
