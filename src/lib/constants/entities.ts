import { Bat, Bullet, Dust, Emitter, Item, Particle, Player, Spikes, Zombie, Torch } from '../models'

export enum ENTITIES_TYPE {
    AMMO = 'ammo',
    BAT = 'bat',
    BOX = 'box',
    BULLET = 'bullet',
    COIN = 'coin',
    DUST = 'dust',
    EMITTER = 'emitter',
    HEALTH = 'health',
    PARTICLE = 'particle',
    PLAYER = 'player',
    SPIKES = 'spikes',
    TORCH = 'torch',
    ZOMBIE = 'zombie'
}

export enum ENTITIES_FAMILY {
    ENEMIES = 'enemies',
    PARTICLES = 'particles',
    TRAPS = 'traps'
}

export const ENTITIES = {
    [ENTITIES_TYPE.AMMO]: Item,
    [ENTITIES_TYPE.BAT]: Bat,
    [ENTITIES_TYPE.BOX]: Item,
    [ENTITIES_TYPE.COIN]: Item,
    [ENTITIES_TYPE.BULLET]: Bullet,
    [ENTITIES_TYPE.DUST]: Dust,
    [ENTITIES_TYPE.EMITTER]: Emitter,
    [ENTITIES_TYPE.HEALTH]: Item,
    [ENTITIES_TYPE.PARTICLE]: Particle,
    [ENTITIES_TYPE.PLAYER]: Player,
    [ENTITIES_TYPE.SPIKES]: Spikes,
    [ENTITIES_TYPE.TORCH]: Torch,
    [ENTITIES_TYPE.ZOMBIE]: Zombie
}

export const ITEMS_GIDS = {
    [ENTITIES_TYPE.AMMO]: 251,
    [ENTITIES_TYPE.COIN]: 202,
    [ENTITIES_TYPE.HEALTH]: 281
}