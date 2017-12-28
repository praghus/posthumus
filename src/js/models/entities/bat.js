import Entity from '../entity'
import { DIRECTIONS, ENTITIES_FAMILY } from '../../lib/constants'

export default class Bat extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.direction = DIRECTIONS.LEFT
        this.maxSpeed = 1
        this.speed = 0.2
        this.energy = 20
        this.maxEnergy = 20
        this.damage = 10
        this.canFly = true
        this.solid = true
        this.animFrame = Math.random() * 6
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 28, h: 20, frames: 6, fps: 16, loop: true},
            LEFT: {x: 0, y: 20, w: 28, h: 20, frames: 6, fps: 16, loop: true}
        }
        this.bounds = {
            x: 2,
            y: 0,
            width: this.width - 4,
            height: this.height
        }
    }

    collide (element) {
        if (element.damage > 0 && element.family !== ENTITIES_FAMILY.ENEMIES) {
            this.hit(element.damage)
        }
    }

    update () {
        if (this.onScreen()) {
            this.awake = true
        }
        if (this.dying) {
            this.kill()
        }
        if (this.awake && !this.dead && !this.dying) {
            const { camera } = this._game
            this.force.y += this.y > this._game.player.y ? -0.01 : 0.01
            this.force.x += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed
            if (this.onScreen()) {
                this.direction = this._game.player.x > this.x ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT
                if (-(this.y + this.force.y) > camera.y) {
                    this.force.y += this.speed
                }
            }
            this.move()
            if (this.expectedX !== this.x) {
                this.force.y -= 0.03
                if (this.expectedY !== this.y) {
                    if (this.expectedX < this.x) {
                        this.direction = DIRECTIONS.RIGHT
                        this.force.x *= -0.6
                    }
                    if (this.expectedX > this.x) {
                        this.direction = DIRECTIONS.LEFT
                        this.force.x *= -0.6
                    }
                }
            }
            else if (this.expectedY !== this.y) {
                this.force.y += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed
            }

            this.animate(this.direction === DIRECTIONS.RIGHT ? this.animations.RIGHT : this.animations.LEFT)
        }
    }
}
