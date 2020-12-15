import { ENTITIES_TYPE } from './entities'
import { LAYERS } from './layers'
import { random, randomInt } from '../helpers'

export const PARTICLES = {
    BLOOD: {
        type: ENTITIES_TYPE.PARTICLE,
        layerId: LAYERS.OBJECTS,
        width: 1,
        height: 1,
        mass: 0.5,
        count: 10, 
        radius: 8,
        color: `rgb(${128 + (randomInt(0, 32) * 4)}, 0, 0)`,
        ttl: () => randomInt(60, 120),
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    },
    DIRT: {
        type: ENTITIES_TYPE.PARTICLE,
        layerId: LAYERS.OBJECTS,
        mass: 0.3,
        width: 2,
        height: 2,
        count: 10, 
        radius: 8,
        color: '#000',
        ttl: () => randomInt(60, 120),
        forceVector: () => ({
            x: Math.cos(randomInt(0, 2) * Math.PI) * 0.8 + randomInt(0, 1),
            y: randomInt(-1, -4)
        })
    },
    RUBBLE: {
        type: ENTITIES_TYPE.PARTICLE,
        layerId: LAYERS.OBJECTS,
        width: 1,
        height: 1,
        mass: 0.5,
        count: 10, 
        radius: 8,
        color: '#000',
        ttl: () => randomInt(60, 120),
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    },
    SPIT: {
        type: ENTITIES_TYPE.PARTICLE,
        layerId: LAYERS.OBJECTS,
        width: 1,
        height: 1,
        mass: 0.5,
        count: 10, 
        radius: 8,
        color: '#fff',
        ttl: () => randomInt(60, 120),
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    }
}
