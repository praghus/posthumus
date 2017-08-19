
import Entity from '../entity'
import { DIRECTIONS, ENTITIES, ENTITIES_FAMILY } from '../../lib/utils'
import { playerReload, playerShoot } from '../../actions/sounds'

export default class Player extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.direction = DIRECTIONS.RIGHT
        this.inDark = 0
        this.energy = 3
        this.maxEnergy = 3
        this.maxSpeed = 2
        this.speed = 0.2
        this.solid = true
        this.ammo = 2
        this.maxAmmo = 8
        this.shootTimeout = null
        this.shootDelay = 500
        this.countToReload = 0
        this.bounds = {
            x: 8,
            y: 8,
            width: this.width - 16,
            height: this.height - 8
        }
        this.animations = {
            LEFT: {x: 704, y: 48, w: 32, h: 48, frames: 8, fps: 15, loop: true},
            RIGHT: {x: 0, y: 48, w: 32, h: 48, frames: 8, fps: 15, loop: true},
            JUMP_LEFT: {x: 512, y: 48, w: 32, h: 48, frames: 4, fps: 15, loop: false},
            JUMP_RIGHT: {x: 256, y: 48, w: 32, h: 48, frames: 4, fps: 15, loop: false},
            STAND_LEFT: {x: 480, y: 48, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            STAND_RIGHT: {x: 448, y: 48, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            FALL_LEFT: {x: 672, y: 48, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            FALL_RIGHT: {x: 416, y: 48, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            SHOOT_LEFT: {x: 160, y: 96, w: 32, h: 48, frames: 5, fps: 11, loop: false},
            SHOOT_RIGHT: {x: 0, y: 96, w: 32, h: 48, frames: 5, fps: 11, loop: false},
            RELOADING: {x: 352, y: 96, w: 32, h: 48, frames: 3, fps: 3, loop: true}
        }
        this.animation = this.animations.STAND_RIGHT
    }

    draw (ctx) {
        ctx.save()
        if (!this.canHurt()) {
            ctx.globalAlpha = 0.2
        }
        super.draw(ctx)
        ctx.restore()
    }

    update () {
        const { input, world } = this._game
        if (!this.dead) {
            if (input.left) {
                this.force.x -= this.speed
                this.direction = DIRECTIONS.LEFT
            }
            if (input.right) {
                this.force.x += this.speed
                this.direction = DIRECTIONS.RIGHT
            }
            if (input.up && this.canJump()) {
                this.doJump = true
            }
            if (input.fire && this.canShoot()) {
                this.shoot()
            }

            // slow down
            if (!input.left && !input.right && this.force.x !== 0) {
                this.force.x += this.direction === DIRECTIONS.RIGHT ? -this.speed : this.speed
                if (this.direction === DIRECTIONS.LEFT && this.force.x > 0 ||
                    this.direction === DIRECTIONS.RIGHT && this.force.x < 0) {
                    this.force.x = 0
                }
            }
        }

        this.force.y += world.gravity

        this.force.x === 0 && this.onFloor
            ? this.countToReload++
            : this.countToReload = 0

        if (this.countToReload === 100) this.reload()

        this.move()

        if (this.doJump || this.jump) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.JUMP_RIGHT
                : this.animations.JUMP_LEFT)
            if (this.animFrame === 2) {
                this.force.y = -8
                this.jump = true
                this.doJump = false
            }
            if (this.force.y > 0) {
                this.jump = false
                this.fall = true
            }
        }
        else if (this.fall) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.FALL_RIGHT
                : this.animations.FALL_LEFT)
        }
        else if (this.force.x !== 0) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT)
        }
        else if (this.shootTimeout && this.force.x === 0) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.SHOOT_RIGHT
                : this.animations.SHOOT_LEFT)
        }
        else if (this.countToReload >= 40 && this.ammo < this.maxAmmo) {
            this.animate(this.animations.RELOADING)
        }
        else {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.STAND_RIGHT
                : this.animations.STAND_LEFT)
        }
    }

    collide (element) {
        if (this.canHurt() && element.damage > 0 && (
            element.family === ENTITIES_FAMILY.ENEMIES ||
            element.family === ENTITIES_FAMILY.TRAPS
        )) {
            this.hit(element.damage)
        }
    }

    hit (s) {
        this.energy -= s
        this.force.y -= 3
        this.hurtTimeout = setTimeout(() => {
            this.hurtTimeout = null
        }, 3000)
    }

    shoot () {
        const { elements, playSound } = this._game
        this.force.x = 0
        this.ammo -= 1
        this.animFrame = 0
        this.countToReload = 0

        elements.add({
            type: ENTITIES.BULLET,
            x: this.direction === DIRECTIONS.RIGHT
                ? this.x + this.width
                : this.x,
            y: this.y + 26,
            direction: this.direction}
        )

        this.flashTimeout = setTimeout(() => {
            this.shootFlash = true
            this.flashTimeout = null
        }, 60)

        this.shootTimeout = setTimeout(() => {
            this.shootTimeout = null
        }, this.shootDelay)

        playSound(playerShoot)
    };

    canShoot () {
        return this.ammo > 0 && !this.shootTimeout && this.onFloor
    }

    canJump () {
        return this.onFloor && !this.doJump && !this.jump
    }

    canHurt () {
        return !this.hurtTimeout
    }

    reload () {
        const { playSound } = this._game
        if (this.ammo < this.maxAmmo) {
            playSound(playerReload)
            this.ammo += 1
            this.reloading = false
            this.countToReload = 40
        }
    };
}
