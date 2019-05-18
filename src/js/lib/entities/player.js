import Character from '../models/character'
import {
    DIRECTIONS,
    INPUTS,
    ITEMS,
    LAYERS,
    ENTITIES_FAMILY,
    ENTITIES_TYPE,
    SOUNDS
} from '../../lib/constants'

export default class Player extends Character {
    constructor (obj, game) {
        super(obj, game)
        this.direction = DIRECTIONS.RIGHT
        this.energy = 30
        this.maxEnergy = 30
        this.maxSpeed = 2
        this.speed = 0.2
        this.ammo = 4
        this.maxAmmo = 4
        this.inDark = 0
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

    draw () {
        const { ctx } = this.game
        ctx.save()
        if (!this.canHurt()) {
            ctx.globalAlpha = 0.2
        }
        super.draw()
        ctx.restore()
    }

    update () {
        const { checkTimeout } = this.game

        this.input()
        this.reload()
        this.move()

        if (this.jump) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.JUMP_RIGHT
                : this.animations.JUMP_LEFT)

            if (this.animFrame === 0 && this.force.x !== 0) {
                this.animFrame = 2
            }
            if (this.animFrame === 2) {
                this.force.y = -7
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
        else if (checkTimeout('player-shoot') && this.force.x === 0) {
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.SHOOT_RIGHT
                : this.animations.SHOOT_LEFT)
        }
        else if (checkTimeout('player-reloading')) {
            this.animate(this.animations.RELOADING)
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

    input () {
        const {
            props: { input }, world
        } = this.game

        if (this.canMove()) {
            if (input.keyPressed[INPUTS.INPUT_LEFT]) {
                this.force.x -= this.speed
                this.direction = DIRECTIONS.LEFT
            }
            if (input.keyPressed[INPUTS.INPUT_RIGHT]) {
                this.force.x += this.speed
                this.direction = DIRECTIONS.RIGHT
            }
            if (input.keyPressed[INPUTS.INPUT_UP] && this.canJump()) {
                this.jump = true
            }
        }
        else this.force.x = 0

        if (input.keyPressed[INPUTS.INPUT_ACTION] && this.canShoot()) {
            this.shoot()
        }
        if (!input.keyPressed[INPUTS.INPUT_LEFT] && !input.keyPressed[INPUTS.INPUT_RIGHT] && this.force.x !== 0) {
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? -this.speed
                : this.speed
            if (this.direction === DIRECTIONS.LEFT && this.force.x > 0 ||
                this.direction === DIRECTIONS.RIGHT && this.force.x < 0) {
                this.force.x = 0
            }
        }
        this.force.y += world.gravity
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
        const {
            debug,
            startTimeout
        } = this.game

        if (!!debug) return

        this.energy -= s

        if (this.energy > 0) {
            this.force.y -= 3
            startTimeout('player-hurt', 1000)
        }
        else {
            // game over
            this.energy = 0
        }
    }

    shoot () {
        const {
            props: { playSound },
            startTimeout,
            world
        } = this.game

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

        startTimeout('player-shoot', 500)
        startTimeout('player-shoot-flash', 60, () => {
            this.shootFlash = true
        })
        playSound(SOUNDS.PLAYER_SHOOT)
    };

    reload () {
        const { props: { playSound } } = this.game

        this.force.x === 0 && this.onFloor
            ? this.countToReload++
            : this.countToReload = 0

        if (this.countToReload === 100 && this.ammo < this.maxAmmo) {
            this.ammo += 1
            this.countToReload = 40
            playSound(SOUNDS.PLAYER_RELOAD)
        }
    }

    freeze (duration) {
        const { startTimeout } = this.game
        this.canMove() && startTimeout('player-freeze', duration)
    }

    canMove () {
        const { checkTimeout } = this.game
        return !checkTimeout('player-freeze')
    }

    canShoot () {
        const { checkTimeout } = this.game
        return this.ammo > 0 && !checkTimeout('player-shoot') && this.onFloor
    }

    canJump () {
        return this.onFloor && !this.jump
    }

    canHurt () {
        const { checkTimeout } = this.game
        return !checkTimeout('player-hurt')
    }

    getItem (item) {
        const {
            checkTimeout,
            startTimeout,
            props: { playSound }
        } = this.game

        if (!checkTimeout('player-get')) {
            const {
                properties: { id }
            } = item

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

            item.kill()

            startTimeout('player-get', 500)
            playSound(SOUNDS.POWER_UP)
        }
    }
}
