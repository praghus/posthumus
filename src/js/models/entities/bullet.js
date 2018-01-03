import Entity from '../entity'
// import { brighten, rgbToHex } from '../../lib/helpers'
import { DIRECTIONS } from '../../lib/constants'

export default class Bullet extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.width = 8
        this.height = 1
        this.speed = 10
        this.maxSpeed = 10
        this.damage = 10
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
                this.particles('#333333', 5)
            }
        }
    }
}
