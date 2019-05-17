import Character from '../models/character'
import { randomInt } from '../../lib/utils/helpers'
import {
    DIRECTIONS,
    ENTITIES_TYPE,
    PARTICLES,
    STATES
} from '../../lib/constants'

export default class Bat extends Character {
    constructor (obj, scene) {
        super(obj, scene)
        this.direction = DIRECTIONS.LEFT
        this.speed = 0.2
        this.maxSpeed = 1
        this.energy = 20
        this.damage = 0
        this.states = [
            STATES.IDLE,
            STATES.FLYING,
            STATES.DYING
        ]
        this.bounds = {
            x: 5,
            y: 0,
            width: this.width - 10,
            height: this.height - 8
        }
        this.animations = {
            IDLE: {x: 168, y: 0, w: 28, h: 20, frames: 1, fps: 0, loop: false},
            RIGHT: {x: 0, y: 0, w: 28, h: 20, frames: 6, fps: 16, loop: true},
            LEFT: {x: 0, y: 20, w: 28, h: 20, frames: 6, fps: 16, loop: true}
        }
        this.setState(STATES.IDLE)
    }

    collide (element) {
        const {
            checkTimeout,
            startTimeout
        } = this._scene

        if (
            element.type === ENTITIES_TYPE.PLAYER &&
            !checkTimeout(`bat-${this.id}-bounce`)
        ) {
            this.bounce()
            this.force.y *= -1
            startTimeout(`bat-${this.id}-bounce`, 1000)
        }
    }

    update () {
        const {
            camera,
            player,
            checkTimeout,
            startTimeout
        } = this._scene

        switch (this.state) {
        case STATES.IDLE:
            if (this.onScreen()) {
                this.activated = true
                this.animate(this.animations.IDLE)
                startTimeout(`bat-${this.id}-awake`, 1000, () => {
                    this.setState(STATES.FLYING)
                })
            }
            break

        case STATES.FLYING:
            this.damage = 10
            this.force.y += this.y > player.y + 10 ? -0.01 : 0.01
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.speed
                : -this.speed

            if (this.onScreen() && !checkTimeout(`bat-${this.id}-bounce`)) {
                this.direction = player.x > this.x
                    ? DIRECTIONS.RIGHT
                    : DIRECTIONS.LEFT
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
                this.force.y += this.direction === DIRECTIONS.RIGHT
                    ? this.speed
                    : -this.speed
            }

            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT
            )
            break

        case STATES.DYING:
            this.emitParticles(
                PARTICLES.DIRT,
                this.x + 8,
                this.y + this.height,
                randomInt(10, 15),
                8
            )
            this.kill()
            break
        }
    }
}
