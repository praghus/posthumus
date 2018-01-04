import Entity from '../entity'
import { overlap } from '../../lib/helpers'

export default class Particle extends Entity {
    constructor (obj, game) {
        super(obj, game)
        const dir = Math.random() * 2 * Math.PI
        this.maxSpeed = 0.5 + Math.random() * 1
        this.force = obj.force || {
            x: Math.cos(dir) * this.maxSpeed,
            y: Math.sin(dir) * this.maxSpeed
        }
        this.life = Math.random() * 30 + 30
        this.mass = obj.mass || 0.3 + Math.random() * 0.7
        this.dead = false
    }

    overlapTest (obj) {
        if (!this.dead && overlap(this, obj)) {
            this.collide(obj)
            obj.collide(this)
        }
    }

    update () {
        if (!this.dead) {
            this.force.y += this.mass
            this.move()
            if (this.y !== this.expectedY || this.x !== this.expectedX) {
                this.force.y *= -0.8
                this.force.x *= 0.9
            }
            this.life--
        }
        if (this.life < 0) {
            this.dead = true
        }
    }

    draw (ctx) {
        const { camera } = this._game
        ctx.save()
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.rect(this.x + camera.x, this.y + camera.y, this.width, this.height)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}
