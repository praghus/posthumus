import Character from '../models/character'
import {
    DIRECTIONS,
    ENTITIES_TYPE,
    LAYERS,
    STATES
} from '../../lib/constants'

export default class Spider extends Character {
    constructor (obj, scene) {
        super(obj, scene)
        this.maxSpeed = 0.5
        this.speed = 0.05
        this.energy = 20
        this.damage = 10
        this.canJump = true
        this.canShoot = true
        this.attack = false
        this.bounds = {
            x: 2,
            y: 0,
            width: this.width - 4,
            height: this.height
        }
        this.states = [
            STATES.IDLE,
            STATES.WALKING,
            STATES.ATTACK,
            STATES.DYING
        ]
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 24, h: 24, frames: 3, fps: 12, loop: true},
            LEFT: {x: 72, y: 0, w: 24, h: 24, frames: 3, fps: 12, loop: true},
            ATTACK_RIGHT: {x: 0, y: 24, w: 24, h: 24, frames: 3, fps: 12, loop: false},
            ATTACK_LEFT: {x: 72, y: 24, w: 24, h: 24, frames: 3, fps: 12, loop: false},
            DEAD: {x: 0, y: 48, w: 24, h: 24, frames: 6, fps: 12, loop: false}
        }

        this.setState(STATES.IDLE)
    }

    hit (damage) {
        super.hit(damage)
        this.turnToPlayer()
    }

    update () {
        const {
            player,
            startTimeout,
            world
        } = this._scene

        switch (this.state) {
        case STATES.IDLE:
            if (this.onScreen() && !this.activated) {
                this.activated = true
                startTimeout(`spider-${this.id}-awake`, 500, () => {
                    this.turnToPlayer()
                    this.setState(STATES.WALKING)
                })
            }
            break

        case STATES.WALKING:
            const distanceFromPlayer = this.direction === DIRECTIONS.RIGHT
                ? player.x - this.x
                : this.x - player.x

            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.speed
                : -this.speed

            if (this.onFloor && this.seesEntity(player)) {
                if (distanceFromPlayer < 120) {
                    if (distanceFromPlayer < 50 && this.canJump && !this.canShoot) {
                        this.canJump = false
                        this.force.y = -5
                        startTimeout(`spider-${this.id}-jump`, 1000, () => {
                            this.canJump = true
                        })
                    }
                    else if (this.canShoot) {
                        this.setState(STATES.ATTACK)
                    }
                }
                else if (this.maxSpeed < 2) {
                    this.maxSpeed += 0.2
                }
            }
            else if (this.maxSpeed > 0.5) {
                this.maxSpeed -= 0.1
            }

            this.move()

            if (this.onFloor) {
                if (this.expectedX !== this.x || this.onLeftEdge || this.onRightEdge) {
                    this.bounce()
                }
            }
            this.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT
            )
            break

        case STATES.ATTACK:
            this.force.x = 0
            this.force.y += world.gravity

            this.move()

            if (this.onFloor) {
                this.animate(this.direction === DIRECTIONS.RIGHT
                    ? this.animations.ATTACK_RIGHT
                    : this.animations.ATTACK_LEFT
                )
                if (this.animFrame === 2) {
                    this.shoot()
                }
            }
            break

        case STATES.DYING:
            this.animate(this.animations.DEAD)
            if (this.animFrame === 5) {
                this.kill()
            }
            break
        }
    }

    shoot () {
        if (this.canShoot) {
            const {
                startTimeout,
                world
            } = this._scene

            world.addObject({
                type: ENTITIES_TYPE.SPIDER_BULLET,
                direction: this.direction,
                x: this.direction === DIRECTIONS.LEFT
                    ? this.x - 8
                    : this.x + this.width,
                y: this.y + 4,
                force: {
                    x: 0,
                    y: -4
                }
            }, LAYERS.OBJECTS)

            startTimeout(`spider-${this.id}-shoot`, 4000, () => {
                this.canShoot = true
            })

            this.canShoot = false
            this.setState(STATES.WALKING)
        }
    }
}
