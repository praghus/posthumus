import ActiveElement from '../models/active-element'
import { randomInt } from '../../lib/helpers'
import { DIRECTIONS } from '../../lib/constants'

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
        if (element.solid) {
            this.dead = true
            this.particles(`rgb(${parseInt(128 + ((Math.random() * 32) * 4))}, 0, 0)`, 5)
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
                this.emitParticles(randomInt(5, 10), {
                    x: this.direction === DIRECTIONS.RIGHT ? this.x + this.width : this.x,
                    y: this.y,
                    width: 1,
                    height: 1,
                    color: '#333333'
                })
            }
        }
    }
}
