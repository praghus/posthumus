import ActiveElement from '../models/active-element'
import { ENTITIES_TYPE, ITEMS } from '../../lib/constants'

export default class Item extends ActiveElement {
    constructor (obj, game) {
        super(obj, game)
        this.width = 16
        this.height = 16
        this.solid = true
        this.y -= this.height
        this.animations = {
            [ITEMS.AMMO]: {x: 16, y: 0, w: 16, h: 16, frames: 1, fps: 0, loop: false},
            [ITEMS.HEALTH]: {x: 32, y: 0, w: 16, h: 16, frames: 1, fps: 0, loop: false},
            [ITEMS.LIVE]: {x: 48, y: 0, w: 16, h: 16, frames: 1, fps: 0, loop: false}
        }
    }

    collide (element) {
        const { player } = this.game
        if (element.type === ENTITIES_TYPE.PLAYER) {
            player.getItem(this)
        }
    }

    update () {
        const { world: { gravity } } = this.game
        if (this.onScreen()) {
            if (this.onFloor) this.force.y *= -0.5
            this.force.y += gravity
            this.move()
            if (this.animations[this.properties.id]) {
                this.animate(this.animations[this.properties.id])
            }
        }
    }
}
