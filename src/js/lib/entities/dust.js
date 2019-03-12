import ActiveElement from '../models/active-element'
import { DIRECTIONS } from '../../lib/constants'

export default class Dust extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.width = 16
        this.height = 16
        this.animations = {
            RIGHT: {x: 0, y: 0, w: 16, h: 16, frames: 9, fps: 24, loop: false},
            LEFT: {x: 0, y: 16, w: 16, h: 16, frames: 9, fps: 24, loop: false}
        }
    }

    update () {
        if (!this.dead) {
            this.animation = this.direction === DIRECTIONS.RIGHT ? this.animations.RIGHT : this.animations.LEFT
            this.animate()
            if (this.animFrame === 8) {
                this.kill()
            }
        }
    }
}
