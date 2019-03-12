import ActiveElement from '../models/active-element'
import { overlap, random, randomInt } from '../../lib/helpers'

export default class Particle extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        const dir = random(0, 2) * Math.PI
        this.maxSpeed = random(0.5, 1)
        this.force = obj.force || {
            x: Math.cos(dir) * this.maxSpeed,
            y: Math.sin(dir) * this.maxSpeed
        }
        this.life = randomInt(120, 360)
        this.mass = obj.mass || random(0.3, 1)
        this.dead = false
    }

    overlapTest (obj) {
        if (!this.dead && overlap(this, obj)) {
            obj.collide && obj.collide(this)
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

    draw () {
        const { ctx, camera } = this._scene
        ctx.save()
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.rect(this.x + camera.x, this.y + camera.y, this.width, this.height)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}
