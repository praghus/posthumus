import ActiveElement from '../models/active-element'
import { randomInt } from '../../lib/helpers'
import { DIRECTIONS } from '../../lib/constants'

// change name to color rectangle
export default class LavaStone extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.damage = 100
        this.width = 4
        this.height = 4
        this.acceleration = 0.5
        this.maxSpeed = 1
        this.damage = 20
        this.color = 'rgb(200,100,0)'
    }

    draw () {
        const { ctx, camera } = this._scene
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x + camera.x, this.y + camera.y, this.width, this.height)
        ctx.restore()
    }

    update () {
        if (!this.dead) {
            this.force.y += this.force.y < 0 ? 0.2 : 0.4
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.acceleration
                : -this.acceleration

            this.move()

            if (this.expectedX !== this.x || this.expectedY !== this.y) {
                this.dead = true
                this.emitParticles(randomInt(5, 10), {
                    x: this.direction === DIRECTIONS.RIGHT ? this.x + this.width : this.x,
                    y: this.y,
                    width: 1,
                    height: 1,
                    color: this.color
                })
            }
        }
    }
}
