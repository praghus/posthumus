import { ASSETS } from './constants'
import Bat from './entities/bat'
import Bullet from './entities/bullet'
import DarkMask from './entities/dark-mask'
import Particle from './entities/particle'
import Player from './entities/player'
import Slope from './entities/slope'
import SpiderTrap from './entities/spider-trap'
import Spikes from './entities/spikes'
import Zombie from './entities/zombie'

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
    JUMP_THROUGH: 'jump_through',
    PARTICLE: 'particle',
    PLAYER: 'player',
    SLOPE: 'slope',
    SPIDER_TRAP: 'spider_trap',
    SPIKES: 'spikes',
    ZOMBIE: 'zombie'
}

export const ENTITIES = [
    { type: ENTITIES_TYPE.PLAYER, model: Player, asset: ASSETS.PLAYER},
    { type: ENTITIES_TYPE.BULLET, family: ENTITIES_FAMILY.BULLETS, model: Bullet, asset: ASSETS.BULLET },
    { type: ENTITIES_TYPE.BAT, family: ENTITIES_FAMILY.ENEMIES, model: Bat, asset: ASSETS.BAT },
    { type: ENTITIES_TYPE.DARK_MASK, family: ENTITIES_FAMILY.MODIFIERS, model: DarkMask },
    { type: ENTITIES_TYPE.PARTICLE, family: ENTITIES_FAMILY.PARTICLES, model: Particle },
    { type: ENTITIES_TYPE.SPIDER_TRAP, family: ENTITIES_FAMILY.TRAPS, model: SpiderTrap, asset: ASSETS.SPIDER_TRAP },
    { type: ENTITIES_TYPE.SPIKES, family: ENTITIES_FAMILY.TRAPS, model: Spikes },
    { type: ENTITIES_TYPE.SLOPE, family: ENTITIES_FAMILY.MODIFIERS, model: Slope },
    { type: ENTITIES_TYPE.ZOMBIE, family: ENTITIES_FAMILY.ENEMIES, model: Zombie, asset: ASSETS.ZOMBIE }
]
