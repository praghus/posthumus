import Character from '../models/character'
import { randomInt } from '../../lib/helpers'
import { DIRECTIONS } from '../../lib/constants'
import { SOUNDS } from '../../lib/sounds'

export default class Zombie extends Character {
    constructor (obj, game) {
        super(obj, game)
        this.direction = DIRECTIONS.LEFT
        this.awake = false
        this.maxSpeed = 0.5
        this.speed = 0.05
        this.energy = 20
        this.dying = false
        this.maxEnergy = 20
        this.damage = 1
        this.tryJump = 0
        this.solid = true
        this.attack = false
        this.bounds = {
            x: 12,
            y: 8,
            width: this.width - 16,
            height: this.height - 8
        }
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 32, h: 48, frames: 12, fps: 8, loop: true},
            LEFT: {x: 384, y: 0, w: 32, h: 48, frames: 12, fps: 8, loop: true},
            RISE: {x: 768, y: 0, w: 32, h: 48, frames: 9, fps: 8, loop: false},
            DEAD: {x: 1056, y: 0, w: 32, h: 48, frames: 7, fps: 16, loop: false},
            ATTACK_RIGHT: {x: 336, y: 0, w: 28, h: 32, frames: 3, fps: 10, loop: true},
            ATTACK_LEFT: {x: 336, y: 32, w: 28, h: 32, frames: 3, fps: 10, loop: true}
        }
        this.animation = this.animations.LEFT
    }

    update () {
        const { player, playSound, world } = this._scene

        if (this.onScreen() && !this.awake) {
            this.animate(this.animations.RISE)
            if (this.animFrame === 1) {
                // @todo: particles models
                this.emitParticles(randomInt(5, 10), {
                    x: this.x + 8,
                    y: this.y + this.height,
                    mass: 0.1,
                    width: 2,
                    height: 2,
                    force: {
                        x: Math.cos(Math.random() * 2 * Math.PI) * 0.5 + Math.random(),
                        y: -7
                    },
                    color: '#000000'
                })
            }
            if (this.animFrame === 8) {
                playSound(SOUNDS.ZOMBIE_GROAN)
                this.awake = true
            }
        }

        if (this.dying) {
            this.animate(this.animations.DEAD)
            if (this.animFrame === 6) {
                playSound(SOUNDS.ZOMBIE_GROAN)
                this.kill()
            }
        }

        if (this.awake && !this.dead && !this.dying) {
            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed

            if (this.attack) {
                this.force.x = 0
            }

            this.move()

            if (this.onFloor) {
                if (this.expectedX !== this.x) {
                    if (this.seesEntity(player)) {
                        this.force.y -= 4
                    }
                    else {
                        if (this.expectedX < this.x) {
                            this.direction = DIRECTIONS.RIGHT
                        }
                        if (this.expectedX > this.x) {
                            this.direction = DIRECTIONS.LEFT
                        }
                    }
                }

                if (this.attack) {
                    this.animate(this.direction === DIRECTIONS.RIGHT
                        ? this.animations.ATTACK_RIGHT
                        : this.animations.ATTACK_LEFT)
                    if (this.animFrame === 2) {
                        this.attack = false
                    }
                }
                else {
                    this.animate(this.direction === DIRECTIONS.RIGHT
                        ? this.animations.RIGHT
                        : this.animations.LEFT)
                }
            }
            this.animate()
        }
    }
}
