import ActiveElement from '../models/active-element'
import { COLORS } from '../../lib/constants'

export default class Torch extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.width = 32
        this.height = 32
        this.y = this.y - 32
        this.animations = {
            SMALL: {x: 0, y: 0, w: 32, h: 32, frames: 8, fps: 24, loop: true},
            BIG: {x: 0, y: 32, w: 32, h: 32, frames: 8, fps: 24, loop: true}
        }
        this.animation = this.gid < 1235
            ? this.animations.SMALL
            : this.animations.BIG
        this.animFrame = Math.round(Math.random() * 8)
        this.light = { distance: 24, color: COLORS.TRANS_WHITE }
    }

    update () {
        if (this.onScreen()) {
            this.animate()
        }
    }
}
