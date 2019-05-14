import ActiveElement from '../models/active-element'
import { DIRECTIONS, ENTITIES_FAMILY, PARTICLES } from '../../lib/constants'

export default class Bullet extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.width = 8
        this.height = 1
        this.speed = 10
        this.maxSpeed = 10
        this.damage = 10
    }

    draw () {
        const { ctx, camera } = this._scene
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x + camera.x, this.y + camera.y, this.width, this.height)
        ctx.restore()
    }

    collide (element) {
        element.solid && element.hit(this.damage, this.force.x)
        if (element.solid) {
            this.dead = true
            if (element.family === ENTITIES_FAMILY.ENEMIES) {
                this.emitParticles(PARTICLES.BLOOD, element.x, this.y, 10)
            }
        }
    }

    update () {
        if (!this.dead) {
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.speed
                : -this.speed

            this.move()

            if (this.expectedX !== this.x) {
                this.dead = true
                this.emitParticles(
                    PARTICLES.RUBBLE,
                    this.direction === DIRECTIONS.RIGHT
                        ? this.x + this.width - 1
                        : this.x - 1,
                    this.y, 5)
            }
        }
    }
}
