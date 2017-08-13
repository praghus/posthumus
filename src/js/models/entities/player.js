import Entity from '../entity'
import { DIRECTIONS, ENTITIES, ENTITIES_FAMILY } from '../../lib/utils'
import { playerReload, playerShoot } from '../../actions/sounds'

export default class Player extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.godMode = true
        this.canShoot = true
        this.canHurt = true
        this.hurtTimeout = null
        this.direction = DIRECTIONS.RIGHT
        this.inDark = 0
        this.energy = 3
        this.maxEnergy = 3
        this.maxSpeed = 2
        this.speed = 0.2
        this.solid = true
        this.items = []
        this.ammo = 2
        this.maxAmmo = 4
        this.shootTimeout = null
        this.shootTimeout = null
        this.shootDelay = 500
        this.countToReload = 0
        this.animations = {
            RIGHT: {x: 0, y: 80, w: 32, h: 48, frames: 8, fps: 15, loop: true},
            JUMP_RIGHT: {x: 256, y: 80, w: 32, h: 48, frames: 5, fps: 15, loop: false},
            FALL_RIGHT: {x: 320, y: 80, w: 32, h: 48, frames: 2, fps: 15, loop: false},
            STAND_RIGHT: {x: 448, y: 80, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            STAND_LEFT: {x: 480, y: 80, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            FALL_LEFT: {x: 512, y: 80, w: 32, h: 48, frames: 2, fps: 15, loop: false},
            JUMP_LEFT: {x: 576, y: 80, w: 32, h: 48, frames: 4, fps: 15, loop: false},
            LEFT: {x: 704, y: 80, w: 32, h: 48, frames: 8, fps: 15, loop: true},
            SHOOT_RIGHT: {x: 0, y: 144, w: 32, h: 48, frames: 5, fps: 11, loop: false},
            SHOOT_LEFT: {x: 160, y: 144, w: 32, h: 48, frames: 5, fps: 11, loop: false},
            RELOADING: {x: 320, y: 144, w: 32, h: 48, frames: 4, fps: 4, loop: true}
        }
        this.animation = this.animations.STAND_RIGHT
    }

    draw (ctx) {
        const { camera, assets } = this._game
        ctx.drawImage(assets.player,
            this.animation.x + (this.animFrame * this.animation.w), this.animation.y + this.animOffset,
            this.animation.w, this.animation.h,
            Math.floor(this.x + camera.x) - 8, Math.floor(this.y + camera.y) - 5, this.animation.w, this.animation.h
        )
    }

    update () {
        const { input, world } = this._game
        // if (this.godMode) this.kill = false;
        if (!this.dead) {
            if (input.action) {
                this.get(null)
                input.action = false
            }
            if (input.left) {
                this.force.x -= this.speed
                this.direction = DIRECTIONS.LEFT
            }
            if (input.right) {
                this.force.x += this.speed
                this.direction = DIRECTIONS.RIGHT
            }
            if (input.up && this.onFloor) {
                this.doJump = true
            }
            if (input.fire && this.canShoot && this.ammo > 0) {
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
        if (this.doJump) {
            this.force.y -= 0.5
            if (this.force.y < -4.5) {
                this.doJump = false
                this.fall = true
            }
        }
        else {
            this.force.y += world.gravity
        }

        this.move()

        if (this.shootTimeout && this.force.x === 0) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.SHOOT_RIGHT
                : this.animations.SHOOT_LEFT)
        }
        else if (this.countToReload >= 40 && this.ammo < this.maxAmmo) {
            this.animate(this.animations.RELOADING)
        }
        else if (this.doJump || this.fall) {
            this.animCount = 0
            if (this.force.y < -2) {
                this.animate(this.direction === DIRECTIONS.RIGHT
                    ? this.animations.JUMP_RIGHT
                    : this.animations.JUMP_LEFT)
            }
            else {
                this.animate(this.direction === DIRECTIONS.RIGHT
                    ? this.animations.FALL_RIGHT
                    : this.animations.FALL_LEFT)
            }
        }
        else if (this.force.x !== 0) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT)
        }
        else {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.STAND_RIGHT
                : this.animations.STAND_LEFT)
        }

        this.force.x === 0
            ? this.countToReload++
            : this.countToReload = 0
        if (this.countToReload === 100) this.reload()
    }

    collide (element) {
        if (element.damage > 0 &&
            (element.family === ENTITIES_FAMILY.ENEMIES || element.family === ENTITIES_FAMILY.TRAPS)) {
            this.hit(element.damage)
        }
    }

    hit (s) {
        if (this.godMode || !this.canHurt) {
            return
        }
        this.energy -= s
        this.force.y -= 3
        this.canHurt = false
        if (this.energy <= 0 && !this.dead) {
            // this.kill = true;
        }
        this.hurtTimeout = setTimeout(() => {
            this.canHurt = true
            this.hurtTimeout = null
        }, 1000)
    }

    shoot () {
        const { elements, playSound } = this._game
        this.canShoot = false
        this.force.x = 0
        this.ammo -= 1
        this.animFrame = 0
        this.countToReload = 0
        elements.add({
            type: ENTITIES.BULLET,
            x: this.direction === DIRECTIONS.RIGHT
                ? this.x + this.width
                : this.x,
            y: this.y + 21,
            direction: this.direction}
        )

        this.flashTimeout = setTimeout(() => {
            this.shootFlash = true
            this.flashTimeout = null
        }, 60)
        this.shootTimeout = setTimeout(() => {
            this.canShoot = true // player.animOffset = 0;
            this.shootTimeout = null
        }, this.shootDelay)
        playSound(playerShoot)
    };

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
