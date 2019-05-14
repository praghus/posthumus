import Character from '../models/character'
import { randomInt } from '../../lib/utils/helpers'
import { DIRECTIONS, PARTICLES, SOUNDS, STATES } from '../../lib/constants'

export default class Zombie extends Character {
    constructor (obj, scene) {
        super(obj, scene)
        this.direction = DIRECTIONS.LEFT
        this.maxSpeed = 0.5
        this.speed = 0.05
        this.energy = 20
        this.maxEnergy = 20
        this.solid = true
        this.bounds = {
            x: 12,
            y: 8,
            width: this.width - 16,
            height: this.height - 8
        }
        this.states = [
            STATES.IDLE,
            STATES.RISING,
            STATES.WALKING,
            STATES.ATTACK,
            STATES.DYING
        ]
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 32, h: 48, frames: 12, fps: 8, loop: true},
            LEFT: {x: 384, y: 0, w: 32, h: 48, frames: 12, fps: 8, loop: true},
            RISE: {x: 768, y: 0, w: 32, h: 48, frames: 9, fps: 6, loop: false},
            DEAD: {x: 1056, y: 0, w: 32, h: 48, frames: 7, fps: 10, loop: false},
            ATTACK_RIGHT: {x: 336, y: 0, w: 28, h: 32, frames: 3, fps: 10, loop: true},
            ATTACK_LEFT: {x: 336, y: 32, w: 28, h: 32, frames: 3, fps: 10, loop: true}
        }
        this.setState(STATES.IDLE)
    }

    hit (damage) {
        super.hit(damage)
        const { player } = this._scene
        if (this.x < player.x && this.direction === DIRECTIONS.LEFT) {
            this.direction = DIRECTIONS.RIGHT
        }
        if (this.x > player.x && this.direction === DIRECTIONS.RIGHT) {
            this.direction = DIRECTIONS.LEFT
        }
    }

    update () {
        const { player, playSound, startTimeout, world } = this._scene

        switch (this.state) {
        case STATES.IDLE:
            if (this.onScreen() && !this.activated) {
                this.activated = true
                startTimeout(`zombie-${this.id}-awake`, 500, () => this.setState(STATES.RISING))
            }
            break

        case STATES.RISING:
            this.animate(this.animations.RISE)
            if (this.animFrame === 1) {
                this.emitParticles(
                    PARTICLES.DIRT,
                    this.x + 8,
                    this.y + this.height,
                    randomInt(5, 10),
                    16
                )
            }
            if (this.animFrame === 8) {
                playSound(SOUNDS.ZOMBIE_GROAN)
                this.setState(STATES.WALKING)
            }
            break

        case STATES.WALKING:
            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed

            this.move()

            if (this.onFloor && this.expectedX !== this.x) {
                this.seesEntity(player)
                    ? this.force.y -= 6
                    : this.bounce()
            }
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT)
            break

        case STATES.DYING:
            this.animate(this.animations.DEAD)
            if (this.animFrame === 6) {
                // playSound(SOUNDS.ZOMBIE_GROAN)
                this.kill()
            }
            break
        }
    }
}
