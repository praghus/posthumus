import { random, randomInt } from '../utils/helpers'

export const PARTICLES = {
    BLOOD: {
        width: 1,
        height: 1,
        mass: 0.5,
        color: `rgb(${parseInt(128 + (randomInt(0, 32) * 4))}, 0, 0)`,
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    },
    DIRT: {
        mass: 0.3,
        width: 2,
        height: 2,
        color: '#000',
        forceVector: () => ({
            x: Math.cos(randomInt(0, 2) * Math.PI) * 0.8 + randomInt(0, 1),
            y: randomInt(-1, -4)
        })
    },
    RUBBLE: {
        width: 1,
        height: 1,
        mass: 0.5,
        color: '#000',
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    },
    SPIT: {
        width: 1,
        height: 1,
        mass: 0.5,
        color: '#fff',
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    }
}
