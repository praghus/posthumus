import Entity from '../entity'
import { DIRECTIONS, ENTITIES, ENTITIES_FAMILY } from '../../lib/utils'
import { randomChoice } from '../../lib/utils'
import { zombieGroan } from '../../actions/sounds'

export default class Zombie extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.family = ENTITIES_FAMILY.ENEMIES
        this.maxSpeed = 0.5
        this.speed = 0.1
        this.energy = 30
        this.maxEnergy = 30
        this.damage = 10
        this.tryJump = 0
        this.solid = true
        this.attack = false
        this.canFall = false
        this.fallTimeout = null
        this.type = randomChoice(['zombie1', 'zombie2'])
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 28, h: 32, frames: 12, fps: 10, loop: true},
            RUN_RIGHT: {x: 0, y: 0, w: 28, h: 32, frames: 12, fps: 20, loop: true},
            ATTACK_RIGHT: {x: 336, y: 0, w: 28, h: 32, frames: 3, fps: 10, loop: true},
            LEFT: {x: 0, y: 32, w: 28, h: 32, frames: 12, fps: 10, loop: true},
            RUN_LEFT: {x: 0, y: 32, w: 28, h: 32, frames: 12, fps: 20, loop: true},
            ATTACK_LEFT: {x: 336, y: 32, w: 28, h: 32, frames: 3, fps: 10, loop: true}
        }
        this.animation = this.animations.LEFT
    }

    hit (damage) {
        this.force.x += -(this.force.x * 4)
        this.force.y = -2
        this.energy -= damage
        if (this.energy <= 0) {
            this.dead = true
            this._game.explosion(this.x, this.y)
            this._game.elements.add('coin', {x: this.x + 8, y: this.y})
        }
    }

    collide (element) {
        const { player } = this._game
        if (element.type === ENTITIES.PLAYER && player.canHurt) {
            this.attack = true
        }
        if (element.type === ENTITIES.SLOPE && !this.canFall) {
            this.canFall = true
            this.fallTimeout = setTimeout(() => {
                this.canFall = false
            }, 2000)
        }
        if (element.damage > 0 && element.family !== ENTITIES_FAMILY.ENEMIES) {
            this.hit(element.damage)
        }
    }

    update () {
        const { world, player, playSound } = this._game

        if (this.onScreen() && !this.awake) {
            this.awake = true
            playSound(zombieGroan)
        }

        if (this.awake && !this.dead) {
            this.force.y += world.gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT ? this.speed : -this.speed

            if (this.attack) {
                this.force.x = 0
            }
            else if (this.seesPlayer() && this.maxSpeed <= 1.5) {
                this.maxSpeed += 0.1
            }
            else if (this.maxSpeed > 0.5) {
                this.maxSpeed -= 0.1
            }

            this.move()

            if (this.onFloor) {
                if (this.expectedX !== this.x) {
                    if (this.seesPlayer() && this.y + this.height >= player.y + player.height) {
                        this.force.y -= 4
                    }
                    else {
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

                if (this.attack) {
                    this.animate(this.direction === DIRECTIONS.RIGHT
                        ? this.animations.ATTACK_RIGHT
                        : this.animations.ATTACK_LEFT)
                    if (this.animFrame === 2) {
                        this.attack = false
                    }
                }
                else {
                    this.maxSpeed > 0.5
                        ? this.animate(this.direction === DIRECTIONS.RIGHT
                            ? this.animations.RUN_RIGHT
                            : this.animations.RUN_LEFT)
                        : this.animate(this.direction === DIRECTIONS.RIGHT
                            ? this.animations.RIGHT
                            : this.animations.LEFT)
                }
            }
            this.animate()
        }
    }
}
