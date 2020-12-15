import { Entity } from 'tiled-platformer-lib'
import { createParticles } from './particle'
import { DIRECTIONS, IMAGES, ENTITIES_TYPE, ENTITIES_FAMILY, LAYERS, PARTICLES } from '../constants'
import { approach } from '../helpers'
import ANIMATIONS from '../animations/dust'

export class Bullet extends Entity {
    public image = IMAGES.BULLET
    public animations = ANIMATIONS
    public collisionLayers = [LAYERS.MAIN]
    public damage = 10
    public speed = { a: 5, d: 1, m: 10 }

    private particle: any = PARTICLES.RUBBLE

    public collide (obj: TPL.Entity) {
        if (obj.solid) {
            obj.hit(this.damage)
            if (!this.dead) {
                this.kill()
                if (obj.family === ENTITIES_FAMILY.ENEMIES) {
                    this.particle = PARTICLES.BLOOD
                }
            }
        }
    }

    public update (scene: TPL.Scene) {
        super.update(scene)
        const { a, m } = this.speed
        if (this.expectedPos.x !== this.x || !scene.onScreen(this)) this.kill()        
        this.dead 
            ? createParticles (scene, this.particle, this.x, this.y) 
            : this.force.x = approach(this.force.x, this.direction === DIRECTIONS.LEFT ? -m : m, a)
    }
}

export function createBullet (x: number, y: number, direction: string) {
    return new Bullet({
        x, y, direction,
        width: 8,
        height: 8,
        layerId: LAYERS.OBJECTS,
        type: ENTITIES_TYPE.BULLET
    })
}
