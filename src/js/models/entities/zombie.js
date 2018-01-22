import Entity from '../entity'
import { DIRECTIONS, ENTITIES_FAMILY } from '../../lib/constants'
import { zombieGroan } from '../../actions/sounds'

export default class Zombie extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.direction = DIRECTIONS.LEFT
        this.maxSpeed = 0.5
        this.speed = 0.05
        this.energy = 20
        this.dying = false
        this.maxEnergy = 20
        this.damage = 1
        this.tryJump = 0
        this.solid = true
        this.attack = false
        this.canFall = false
        this.fallTimeout = null
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

    collide (element) {
        // const { player } = this._game
        // if (element.type === ENTITIES.PLAYER && player.canHurt) {
        //     this.attack = true
        // }
        if (element.damage > 0 && element.family !== ENTITIES_FAMILY.ENEMIES) {
            this.hit(element.damage)
        }
    }

    update () {
        const { elements, world, playSound } = this._game

        if (this.onScreen() && !this.awake) {
            this.animate(this.animations.RISE)
            if (this.animFrame === 1) {
                elements.emitParticles(5 + parseInt(Math.random() * 5), {
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
                playSound(zombieGroan)
                this.awake = true
            }
        }

        if (this.dying) {
            this.animate(this.animations.DEAD)
            if (this.animFrame === 6) {
                // playSound(zombieGroan)
                this.kill()
            }
        }

        if (this.awake && !this.dead && !this.dying) {
            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed

            if (this.attack) {
                this.force.x = 0
            }
            // else if (this.seesPlayer() && this.maxSpeed <= 1.5) {
            //     this.maxSpeed += 0.1
            // }
            // else if (this.maxSpeed > 0.5) {
            //     this.maxSpeed -= 0.1
            // }

            this.move()

            if (this.onFloor) {
                if (this.expectedX !== this.x) {
                    if (this.seesPlayer()) {
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

                // if (this.onLeftEdge) this.direction = DIRECTIONS.RIGHT
                // if (this.onRightEdge) this.direction = DIRECTIONS.LEFT
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
