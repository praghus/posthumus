import ActiveElement from '../models/active-element'
import { overlap } from '../../lib/helpers'

export default class DarkMask extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.solid = false
        this.active = false
        this.activated = false
        this.visible = false
    }

    update () {
        const { player, world } = this._scene
        if (this.onScreen()) {
            if (overlap(player, this)) {
                this.active = true
                if (!this.activated) {
                    player.inDark += 1
                    this.activated = true
                    if (this.properties) {
                        if (this.properties.showLayer) {
                            world.showLayer(this.properties.showLayer)
                        }
                        else if (this.properties.hideLayer) {
                            world.hideLayer(this.properties.hideLayer)
                        }
                    }
                }
            }
            else this.deactivate()
        }
        else this.deactivate()
    }

    deactivate () {
        const { player } = this._scene
        if (this.active) {
            player.inDark -= 1
            this.activated = false
            this.active = false
        }
    }
}
