import { Color } from 'platfuse'

export enum Directions {
    Up = 'up',
    Right = 'right',
    Down = 'down',
    Left = 'left'
}

export enum ObjectTypes {
    Bat = 'bat',
    Box = 'box',
    Bullet = 'bullet',
    Dust = 'dust',
    Player = 'player',
    Zombie = 'zombie'
}

export const BloodParticle = {
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

export const BoxParticle = {
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
