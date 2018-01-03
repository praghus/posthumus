import Entity from '../entity'
import { DIRECTIONS, ENTITIES_FAMILY, ENTITIES_TYPE } from '../../lib/constants'

export default class Spider extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.direction = DIRECTIONS.LEFT
        this.maxSpeed = 0.5
        this.attack = false
        this.speed = 0.1
        this.energy = 20
        this.maxEnergy = 20
        this.damage = 0.5
        this.solid = true
        this.canShoot = true
        this.shootDelay = 4000
        this.attackDelay = 500
        this.shootTimeout = null
        this.attackTimeout = null
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 24, h: 24, frames: 3, fps: 12, loop: true},
            LEFT: {x: 72, y: 0, w: 24, h: 24, frames: 3, fps: 12, loop: true},
            ATTACK_RIGHT: {x: 0, y: 24, w: 24, h: 24, frames: 3, fps: 12, loop: false},
            ATTACK_LEFT: {x: 72, y: 24, w: 24, h: 24, frames: 3, fps: 12, loop: false},
            DEAD: {x: 0, y: 48, w: 24, h: 24, frames: 6, fps: 12, loop: false}
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
        const { player } = this._game
        if (this.onScreen()) {
            this.awake = true
        }

        if (this.awake && !this.dead && !this.dying) {
            const { world } = this._game
            const distanceFromPlayer = this.direction === DIRECTIONS.RIGHT
                ? player.x - this.x
                : this.x - player.x

            this.force.y += world.gravity

            if (this.attack) {
                this.force.x = 0
            }
            else {
                this.force.x += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed
            }

            if (this.seesPlayer()) {
                if (distanceFromPlayer < 120 && !this.attackTimeout && this.canShoot) {
                    this.attack = true
                    this.attackTimeout = setTimeout(() => {
                        this.attackTimeout = null
                    }, this.attackDelay)
                }
                else if (this.maxSpeed < 2) {
                    this.maxSpeed += 0.2
                }

                if (distanceFromPlayer < 50 && !this.attack && this.onFloor) {
                    this.jump = true
                }
            }
            else if (this.maxSpeed > 0.5) {
                this.maxSpeed -= 0.1
            }

            if (this.jump) {
                this.force.y = -5
                this.jump = false
            }

            this.move()

            if (this.onFloor) {
                if (this.expectedX !== this.x || this.onLeftEdge || this.onRightEdge) {
                    this.force.x = 0
                    if (this.expectedX < this.x || this.onLeftEdge) {
                        this.direction = DIRECTIONS.RIGHT
                    }
                    if (this.expectedX > this.x || this.onRightEdge) {
                        this.direction = DIRECTIONS.LEFT
                    }
                }
            }
        }

        if (this.dying) {
            this.animate(this.animations.DEAD)
            if (this.animFrame === 5) this.kill()
        }
        else if (this.attack) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.ATTACK_RIGHT
                : this.animations.ATTACK_LEFT
            )
            if (this.animFrame === 2) {
                this.attack = false
                this.shoot()
            }
        }
        else if (!this.dead) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT
            )
        }
    }

    shoot () {
        if (this.canShoot) {
            const { elements } = this._game
            this.canShoot = false
            elements.add({
                type: ENTITIES_TYPE.SPIDER_BULLET,
                direction: this.direction,
                x: this.direction === DIRECTIONS.LEFT
                    ? this.x - 8
                    : this.x + this.width,
                y: this.y + 4
            })
            this.shootTimeout = setTimeout(() => {
                this.canShoot = true
                this.attack = false
                this.shootTimeout = null
            }, this.shootDelay)
        }
    }
}
