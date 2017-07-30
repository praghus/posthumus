import Entity from '../entity'
import { DIRECTIONS, ENTITIES_FAMILY } from '../../lib/utils'

export default class Player extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.godMode = true
        this.canShoot = true
        this.canHurt = true
        this.direction = DIRECTIONS.RIGHT
        this.inDark = 0
        this.energy = 30
        this.maxEnergy = 30
        this.maxSpeed = 2
        this.speed = 0.2
        this.coinCollect = 0
        this.throwDelay = 500
        this.shootDelay = 500
        this.throwSpeed = 0
        this.throwMaxSpeed = 5
        this.solid = true
        this.items = []
        this.animations = {
            RIGHT: {x: 0, y: 16, w: 32, h: 48, frames: 8, fps: 15, loop: true},
            JUMP_RIGHT: {x: 256, y: 16, w: 32, h: 48, frames: 5, fps: 15, loop: false},
            FALL_RIGHT: {x: 320, y: 16, w: 32, h: 48, frames: 2, fps: 15, loop: false},
            STAND_RIGHT: {x: 448, y: 16, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            STAND_LEFT: {x: 480, y: 16, w: 32, h: 48, frames: 1, fps: 15, loop: false},
            FALL_LEFT: {x: 512, y: 16, w: 32, h: 48, frames: 2, fps: 15, loop: false},
            JUMP_LEFT: {x: 576, y: 16, w: 32, h: 48, frames: 4, fps: 15, loop: false},
            LEFT: {x: 704, y: 16, w: 32, h: 48, frames: 8, fps: 15, loop: true},
            DEAD_RIGHT: {x: 448, y: 128, w: 32, h: 64, frames: 1, fps: 15, loop: false},
            DEAD_LEFT: {x: 480, y: 128, w: 32, h: 64, frames: 1, fps: 15, loop: false}
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
        const {input} = this._game
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
            if (this.onFloor && input.up) {
                this.doJump = true
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
            this.force.y += this._game.world.gravity
        }
        this.move()

        if (this.doJump || this.fall) {
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
        setTimeout(() => {
            this.canHurt = true
        }, 1000)
    }
}
