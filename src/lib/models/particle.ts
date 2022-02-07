import { Entity, Game, Scene, Vec2 } from 'platfuse'
import { StringTMap } from '../types'
import { random, randomInt } from '../utils'
import { ENTITY_FAMILY, ENTITY_TYPES, LAYERS } from '../constants'

export default class Particle extends Entity {
    family = ENTITY_FAMILY.PARTICLES
    collisionLayers = [LAYERS.MAIN]
    collisions = true
    mass: number
    life: number

    constructor(obj: StringTMap<any>) {
        super(obj)
        const dir = randomInt(0, 2) * Math.PI
        const maxSpeed = randomInt(0.5, 1)
        this.mass = obj.mass || randomInt(0.3, 1)
        this.life = obj.life || randomInt(60, 120)
        this.force = obj.force || {
            x: Math.cos(dir) * maxSpeed,
            y: Math.sin(dir) * maxSpeed
        }
        // this.setCollisionArea()
    }

    public update(game: Game): void {
        if (!this.dead) {
            super.update(game)
            if (this.pos.y !== this.expectedPos.y || this.pos.x !== this.expectedPos.x) {
                this.force.y *= -0.8
                this.force.x *= 0.9
            }
            this.force.y += this.mass
            this.life--
        }
        if (this.life < 0) this.kill()
    }
}

export function createParticles(scene: Scene, pos: Vec2, config: any) {
    const { count, radius } = config
    for (let i = 0; i < count; i++) {
        scene.addObject(
            new Particle({
                x: pos.x - radius / 2 + randomInt(0, radius),
                y: pos.y - radius / 2 + randomInt(0, radius),
                force: config.forceVector(),
                life: config.ttl(),
                ...config
            })
        )
    }
}

export const PARTICLES = {
    BLOOD: {
        type: ENTITY_TYPES.PARTICLE,
        layerId: LAYERS.OBJECTS,
        width: 1,
        height: 1,
        mass: 0.5,
        count: 10,
        radius: 8,
        color: `rgb(${128 + randomInt(0, 32) * 4}, 0, 0)`,
        ttl: () => randomInt(60, 120),
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    },
    DIRT: {
        type: ENTITY_TYPES.PARTICLE,
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
        type: ENTITY_TYPES.PARTICLE,
        layerId: LAYERS.OBJECTS,
        width: 2,
        height: 2,
        mass: 0.5,
        count: 10,
        radius: 8,
        color: '#000',
        ttl: () => randomInt(60, 120),
        forceVector: () => ({
            x: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1),
            y: Math.cos(random(0, 2) * Math.PI) * 0.5 + random(0, 1)
        })
    }
}
