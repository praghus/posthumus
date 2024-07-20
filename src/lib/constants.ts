import { Color } from 'platfuse'

enum Directions {
    Up = 'up',
    Right = 'right',
    Down = 'down',
    Left = 'left'
}

enum ObjectTypes {
    Bat = 'bat',
    Box = 'box',
    Bullet = 'bullet',
    Dust = 'dust',
    Item = 'item',
    Player = 'player',
    Spikes = 'spikes',
    Zombie = 'zombie'
}

enum Items {
    Ammo = 187,
    Coin = 182,
    Health = 177
}

const OneWayTiles = [10, 11, 74, 96]

const BloodParticle = {
    angle: Math.PI,
    emitSize: 0.2,
    emitTime: 0.2,
    emitRate: 50,
    colorStart: new Color(255, 0, 0, 1),
    colorEnd: new Color(255, 0, 0, 0.1),
    ttl: 1,
    sizeStart: 0.05,
    sizeEnd: 0.1,
    speed: 0.1,
    angleSpeed: 0.1,
    damping: 1,
    angleDamping: 0.95,
    gravityScale: 0.5,
    fadeRate: 0.1,
    randomness: 0.5,
    collideTiles: true,
    collideObjects: false,
    renderOrder: 1,
    elasticity: 0,
    stretchScale: 0.3
}

const BoxParticle = {
    angle: Math.PI,
    emitSize: 0.2,
    emitTime: 0.2,
    emitRate: 32,
    colorStart: new Color('#685f58'),
    colorEnd: new Color('#43403b'),
    ttl: 3,
    sizeStart: 0.08,
    sizeEnd: 0.1,
    speed: 0.2,
    angleSpeed: 0.2,
    damping: 1,
    angleDamping: 0.95,
    gravityScale: 0.3,
    fadeRate: 0.1,
    randomness: 0.5,
    collideTiles: true,
    collideObjects: false,
    renderOrder: 1,
    elasticity: 0,
    stretchScale: 0.3
}

export { Directions, ObjectTypes, Items, OneWayTiles, BloodParticle, BoxParticle }
