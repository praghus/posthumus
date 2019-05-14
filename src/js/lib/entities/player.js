import Character from '../models/character'
// import { playerJump, playerGet } from '../../actions/sounds'
import {
    DIRECTIONS, INPUTS, ITEMS, LAYERS, ENTITIES_FAMILY, ENTITIES_TYPE, SOUNDS
} from '../../lib/constants'

export default class Player extends Character {
    constructor (obj, scene) {
        super(obj, scene)
        this.direction = DIRECTIONS.RIGHT
        this.inDark = 0
        this.canMove = true
        this.energy = 20
        this.maxEnergy = 30
        this.maxSpeed = 2
        this.speed = 0.2
        this.solid = true
        this.ammo = 2
        this.maxAmmo = 2
        this.shootTimeout = null
        this.shootDelay = 500
        this.freezeTimeout = null
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

    // draw (ctx) {
    //     ctx.save()
    //     if (!this.canHurt()) {
    //         ctx.globalAlpha = 0.2
    //     }
    //     super.draw(ctx)
    //     ctx.restore()
    // }

    update () {
        const { input, world } = this._scene
        if (!this.dead) {
            if (this.canMove) {
                if (input[INPUTS.INPUT_LEFT]) {
                    this.force.x -= this.speed
                    this.direction = DIRECTIONS.LEFT
                }
                if (input[INPUTS.INPUT_RIGHT]) {
                    this.force.x += this.speed
                    this.direction = DIRECTIONS.RIGHT
                }
                if (input[INPUTS.INPUT_UP] && this.canJump()) {
                    this.jump = true
                }
            }
            if (input[INPUTS.INPUT_ACTION]) {
                this.shoot()
            }

            // slow down
            if (!input[INPUTS.INPUT_LEFT] && !input[INPUTS.INPUT_RIGHT] && this.force.x !== 0) {
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

        if (this.canMove) this.move()

        if (this.jump) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.JUMP_RIGHT
                : this.animations.JUMP_LEFT)

            if (this.animFrame === 0 && this.force.x !== 0) {
                this.animFrame = 2
            }

            if (this.animFrame === 2) {
                this.force.y = -7
                this.jump = true
            }
            if (this.force.y >= 0) {
                this.jump = false
                this.fall = true
            }
        }
        else if (this.fall) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.FALL_RIGHT
                : this.animations.FALL_LEFT)
            if (this.force.y === 0) this.fall = false
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
        // im immortal in debug mode
        if (!!this._scene.debug) return

        this.maxEnergy -= s
        this.maxEnergy <= 0
            ? this.maxEnergy = 0
            : this.force.y -= 3
    }

    shoot () {
        if (this.canShoot()) {
            const { playSound, world } = this._scene
            this.force.x = 0
            this.ammo -= 1
            this.animFrame = 0
            this.countToReload = 0

            world.addObject({
                type: ENTITIES_TYPE.BULLET,
                x: this.direction === DIRECTIONS.RIGHT
                    ? this.x + this.width
                    : this.x,
                y: this.y + 26,
                direction: this.direction
            }, LAYERS.OBJECTS)

            this.flashTimeout = setTimeout(() => {
                this.shootFlash = true
                this.flashTimeout = null
            }, 60)

            this.shootTimeout = setTimeout(() => {
                this.shootTimeout = null
            }, this.shootDelay)

            playSound(SOUNDS.PLAYER_SHOOT)
        }
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

    freeze (delay) {
        if (this.canMove) {
            this.canMove = false
            this.freezeTimeout = setTimeout(() => {
                this.freezeTimeout = null
                this.canMove = true
            }, delay)
        }
    }

    reload () {
        const { playSound } = this._scene
        if (this.ammo < this.maxAmmo) {
            playSound(SOUNDS.PLAYER_RELOAD)
            this.ammo += 1
            this.reloading = false
            this.countToReload = 40
        }
    }

    getItem (item) {
        const { properties: { id }} = item
        const { playSound } = this._scene

        switch (id) {
        case ITEMS.AMMO:
            this.ammo += 1
            this.maxAmmo += 1
            break

        case ITEMS.HEALTH:
            if (this.energy < this.maxEnergy) {
                this.energy += 10
            }
            break

        case ITEMS.LIVE:
            this.energy += 10
            this.maxEnergy += 10
            break
        }
        playSound(SOUNDS.POWER_UP)
        item.kill()
    }
}
