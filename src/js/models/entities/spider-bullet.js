import Entity from '../entity'
import { DIRECTIONS, ENTITIES_TYPE } from '../../lib/constants'

export default class SpiderBullet extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.width = 8
        this.height = 8
        this.speed = 1
        this.maxSpeed = 5
        this.force = {x: 0, y: -4}
        this.animation = {x: 0, y: 0, w: 6, h: 6, frames: 5, fps: 20, loop: false}
    }

    collide (element) {
        const { elements, player } = this._game
        if (element.solid) {
            this.dead = true
            this.particles('#ffffff', 10)
        }
        if (element.type === ENTITIES_TYPE.PLAYER) {
            elements.add({
                type: ENTITIES_TYPE.SPIDER_WEB,
                x: player.x,
                y: player.y
            })
        }
    }

    update () {
        if (!this.dead) {
            const { world } = this._game
            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.speed
                : -this.speed

            this.move()

            if (this.expectedX !== this.x || this.expectedY !== this.y) {
                this.dead = true
                this.particles('#ffffff', 10)
            }
            this.animate(this.animation)
        }
    }
}
