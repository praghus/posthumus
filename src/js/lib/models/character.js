import Entity from './entity'
import { randomInt, between } from '../../lib/utils/helpers'
import {
    ITEMS, STATES, ENTITIES_TYPE, LAYERS
} from '../../lib/constants'

export default class Character extends Entity {
    constructor (obj, scene) {
        super(obj, scene)
        this.solid = true
        this.visible = true
    }

    draw () {
        super.draw()
        const { debug, overlay } = this._scene
        this.hint && overlay.addHint(this)
        this.onScreen() && debug && overlay.displayDebug(this)
    }

    produceItem (id) {
        const { world } = this._scene
        world.addObject({
            id,
            type: ENTITIES_TYPE.ITEM,
            x: this.x + this.width / 2,
            y: this.y,
            properties: { id }
        }, LAYERS.OBJECTS)
    }

    hit (damage) {
        if (!this.dead) {
            if (this.energy && this.energy > 0) {
                this.energy -= damage
                if (this.energy <= 0) {
                    this.force.y = 2
                    this.setState(STATES.DYING)
                    const choice = randomInt(0, 10)
                    if (between(choice, 2, 5)) {
                        this.produceItem(ITEMS.AMMO)
                    }
                    if (between(choice, 6, 8)) {
                        this.produceItem(ITEMS.HEALTH)
                    }
                    if (between(choice, 9, 10)) {
                        this.produceItem(ITEMS.LIVE)
                    }
                }
                else {
                    this.force.x *= -1
                    this.force.y = -2
                }
            }
        }
    }
}
