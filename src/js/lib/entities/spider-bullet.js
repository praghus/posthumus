import ActiveElement from '../models/active-element'
import {
    DIRECTIONS,
    ENTITIES_TYPE,
    LAYERS,
    PARTICLES
} from '../../lib/constants'

export default class SpiderBullet extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.width = 8
        this.height = 8
        this.speed = 1
        this.maxSpeed = 5
        this.animation = { x: 0, y: 0, w: 6, h: 6, frames: 5, fps: 20, loop: false }
    }

    collide (element) {
        const { player, world } = this._scene
        if (element.solid && element.type !== ENTITIES_TYPE.SPIDER) {
            this.kill()
            this.emitParticles(PARTICLES.SPIT, this.x, this.y, 10)
        }
        if (element.type === ENTITIES_TYPE.PLAYER) {
            world.addObject({
                type: ENTITIES_TYPE.SPIDER_WEB,
                x: player.x,
                y: player.y
            }, LAYERS.OBJECTS)
        }
    }

    update () {
        if (!this.dead) {
            const { world } = this._scene
            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.speed
                : -this.speed

            this.move()

            if (this.expectedX !== this.x || this.expectedY !== this.y) {
                this.kill()
                this.emitParticles(PARTICLES.SPIT, this.x, this.y, 10)
            }

            this.animate()
        }
    }
}
