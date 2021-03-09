import { Entity, Scene } from 'tiled-platformer-lib'
import { StringTMap } from '../types'
import { randomInt } from '../helpers'
import { ENTITIES_FAMILY, LAYERS } from '../constants'

export class Particle extends Entity {
    public family = ENTITIES_FAMILY.PARTICLES
    public collisionLayers = [LAYERS.MAIN]
    
    private mass: number
    private life = randomInt(60, 120)

    constructor (obj: StringTMap<any>) {
        super(obj)
        const dir = randomInt(0, 2) * Math.PI
        const maxSpeed = randomInt(0.5, 1)
        this.mass = obj.mass || randomInt(0.3, 1)
        this.force = obj.force || {
            x: Math.cos(dir) * maxSpeed,
            y: Math.sin(dir) * maxSpeed
        }
    }

    public update (scene: Scene): void {
        if (!this.dead) {
            super.update(scene)
            if (
                this.y !== this.expectedPos.y ||
                this.x !== this.expectedPos.x
            ) {
                this.force.y *= -0.8
                this.force.x *= 0.9
            }
            this.force.y += this.mass
            this.life--
        }
        if (this.life < 0) this.kill()
    }
}

export function createParticles (scene: Scene, config: any, x: number, y: number) {
    const { count, radius } = config
    for (let i = 0; i < count; i++) {
        scene.addObject(new Particle({
            x: x - (radius / 2) + randomInt(0, radius),
            y: y - (radius / 2) + randomInt(0, radius),
            force: config.forceVector(),
            life: config.ttl(),
            ...config
        }))
    }
}
