import Entity from '../entity'
import { ENTITIES_FAMILY } from '../../lib/utils'
import { overlap } from '../../lib/utils'

export default class Particle extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.family = this.family = ENTITIES_FAMILY.PARTICLES
        this.life = Math.random() * 30 + 30
        this.maxSpeed = 0.5 + Math.random()
        this.dead = false
        switch (this.type) {
        case 'shoot_particles':
            this.force = {
                x: Math.random() * 2 - 1,
                y: Math.random() * -4 - 2
            }
            break
        default:
            const dir = Math.random() * 2 * Math.PI
            this.force = {
                x: Math.cos(dir) * this.maxSpeed,
                y: Math.sin(dir) * this.maxSpeed
            }
            break
        }
    }

    overlapTest (obj) {
        if (!this.dead && overlap(this, obj)) {
            this.collide(obj)
            obj.collide(this)
        }
    }

    update () {
        const { gravity } = this._game.world
        if (!this.dead) {
            this.force.y += gravity
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
        ctx.fillStyle = this.properties.color
        ctx.beginPath()
        ctx.rect(this.x + camera.x, this.y + camera.y, this.width, this.height)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}
