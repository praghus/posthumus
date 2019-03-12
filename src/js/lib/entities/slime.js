import Character from '../models/character'
import { DIRECTIONS } from '../../lib/constants'

export default class Slime extends Character {
    constructor (obj, scene) {
        super(obj, scene)
        this.maxSpeed = 0
        this.damage = 25
        this.acceleration = 0.2
        this.running = false
        this.bounds = {
            x: 18,
            y: 40,
            width: this.width - 36,
            height: this.height - 40
        }
        this.animations = {
            BOUNCE: {x: 0, y: 0, w: 48, h: 48, frames: 9, fps: 12, loop: true},
            RUN_LEFT: {x: 0, y: 48, w: 48, h: 48, frames: 14, fps: 12, loop: true},
            RUN_RIGHT: {x: 0, y: 96, w: 48, h: 48, frames: 14, fps: 12, loop: true}
        }
        this.direction = this.properties && this.properties.direction || DIRECTIONS.LEFT
        this.wait()
    }

    update () {
        if (this.onScreen()) {
            const { world } = this._scene
            const { gravity } = world

            if (this.running) {
                switch (this.animFrame) {
                case 2:
                    this.maxSpeed = 1.4
                    break
                case 12:
                    this.maxSpeed = 0
                    break
                case 13:
                    this.wait()
                    break
                }
            }

            this.force.y += gravity
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.acceleration
                : -this.acceleration

            this.move()

            if (
                this.expectedX !== this.x ||
                this.onRightEdge ||
                this.onLeftEdge
            ) {
                this.bounce()
            }

            if (this.direction === DIRECTIONS.RIGHT) {
                this.animate(this.running
                    ? this.animations.RUN_RIGHT
                    : this.animations.BOUNCE
                )
            }
            else {
                this.animate(this.running
                    ? this.animations.RUN_LEFT
                    : this.animations.BOUNCE
                )
            }
        }
    }

    wait () {
        this.maxSpeed = 0
        this.running = false
        this._scene.startTimeout({name: `wait_${this.id}`, duration: 2300}, () => {
            this.running = true
        })
    }
}
