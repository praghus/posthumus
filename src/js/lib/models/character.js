import { Entity } from 'tmx-platformer-lib'
import { ENTITIES_TYPE } from '../../lib/entities'
import { DIRECTIONS, LAYERS, TIMEOUTS } from '../../lib/constants'

export default class Character extends Entity {
    constructor (obj, scene) {
        super(obj, scene)
        this.solid = true
        this.visible = true
        this.hideHint = () => {
            this.hint = null
        }
    }

    draw () {
        super.draw()
        const { debug, overlay } = this._scene
        this.hint && overlay.addHint(this)
        this.onScreen() && debug && overlay.displayDebug(this)
    }

    showHint (item) {
        if (!this._scene.checkTimeout(TIMEOUTS.HINT)) {
            this.hint = item.animation
            this._scene.startTimeout(TIMEOUTS.HINT, this.hideHint)
        }
    }

    bounce () {
        this.direction = this.direction === DIRECTIONS.RIGHT
            ? DIRECTIONS.LEFT
            : DIRECTIONS.RIGHT
        this.force.x *= -1
    }

    addDust (direction) {
        if (!this.onFloor) return
        const { world } = this._scene
        world.addObject({
            type: ENTITIES_TYPE.DUST,
            visible: true,
            x: direction === DIRECTIONS.RIGHT
                ? this.x - 4
                : this.x + this.width - 8,
            y: this.y + this.height - 16,
            direction
        }, LAYERS.OBJECTS)
    }
}
