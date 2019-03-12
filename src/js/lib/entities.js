import { ASSETS } from './constants'

import Bat from './entities/bat'
import Bullet from './entities/bullet'
import Checkpoint from './entities/checkpoint'
import Crusher from './entities/crusher'
import DarkMask from './entities/dark-mask'
import Dust from './entities/dust'
import Lava from './entities/lava'
import LavaStone from './entities/lava-stone'
import Particle from './entities/particle'
import Player from './entities/player'
import Rock from './entities/rock'
import Slime from './entities/slime'
import Slope from './entities/slope'
import SpiderTrap from './entities/spider-trap'
import Spikes from './entities/spikes'
import Torch from './entities/torch'
import Trigger from './entities/trigger'

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
    SLIME: 'slime',
    CHECKPOINT: 'checkpoint',
    CRUSHER: 'crusher',
    DARK_MASK: 'dark_mask',
    DUST: 'dust',
    JUMP_THROUGH: 'jump_through',
    LAVA: 'lava',
    LAVA_STONE: 'lava_stone',
    PARTICLE: 'particle',
    PLAYER: 'player',
    ROCK: 'rock',
    SLOPE: 'slope',
    SPIDER_TRAP: 'spider_trap',
    SPIKES: 'spikes',
    TORCH: 'torch',
    TRIGGER: 'trigger'
}

export const ENTITIES = [
    { type: ENTITIES_TYPE.PLAYER, model: Player, asset: ASSETS.PLAYER},
    { type: ENTITIES_TYPE.BULLET, family: ENTITIES_FAMILY.BULLETS, model: Bullet, asset: ASSETS.BULLET },
    { type: ENTITIES_TYPE.BAT, family: ENTITIES_FAMILY.ENEMIES, model: Bat, asset: ASSETS.BAT },
    { type: ENTITIES_TYPE.CHECKPOINT, family: ENTITIES_FAMILY.MODIFIERS, model: Checkpoint },
    { type: ENTITIES_TYPE.CRUSHER, family: ENTITIES_FAMILY.TRAPS, model: Crusher, asset: ASSETS.CRUSHER },
    { type: ENTITIES_TYPE.DARK_MASK, family: ENTITIES_FAMILY.MODIFIERS, model: DarkMask },
    { type: ENTITIES_TYPE.DUST, family: ENTITIES_FAMILY.PARTICLES, model: Dust, asset: ASSETS.DUST },
    { type: ENTITIES_TYPE.LAVA, family: ENTITIES_FAMILY.TRAPS, model: Lava, asset: ASSETS.LAVA },
    { type: ENTITIES_TYPE.LAVA_STONE, family: ENTITIES_FAMILY.TRAPS, model: LavaStone },
    { type: ENTITIES_TYPE.PARTICLE, family: ENTITIES_FAMILY.PARTICLES, model: Particle },
    { type: ENTITIES_TYPE.ROCK, family: ENTITIES_FAMILY.TRAPS, model: Rock, asset: ASSETS.ROCK},
    { type: ENTITIES_TYPE.SLIME, family: ENTITIES_FAMILY.ENEMIES, model: Slime, asset: ASSETS.SLIME },
    { type: ENTITIES_TYPE.SPIDER_TRAP, family: ENTITIES_FAMILY.TRAPS, model: SpiderTrap, asset: ASSETS.SPIDER_TRAP },
    { type: ENTITIES_TYPE.SPIKES, family: ENTITIES_FAMILY.TRAPS, model: Spikes },
    { type: ENTITIES_TYPE.SLOPE, family: ENTITIES_FAMILY.MODIFIERS, model: Slope },
    { type: ENTITIES_TYPE.TORCH, family: ENTITIES_FAMILY.MODIFIERS, model: Torch, asset: ASSETS.TORCH },
    { type: ENTITIES_TYPE.TRIGGER, family: ENTITIES_FAMILY.MODIFIERS, model: Trigger }
]
