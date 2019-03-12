import ActiveElement from '../models/active-element'
// import { clearInRange } from '../../lib/helpers'
import { ENTITIES_TYPE } from '../../lib/entities'
import { INPUTS, LAYERS } from '../../lib/constants'

export default class Trigger extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.solid = false
        this.visible = false
    }

    collide (element) {
        const { camera, input, player, overlay, world } = this._scene
        const { activator, follow, hint, offsetX, offsetY, related, kill, anchor_hint } = this.properties
        const triggered = !this.activated && (input[INPUTS.INPUT_ACTION] || activator === ENTITIES_TYPE.PLAYER)

        if (element.type === ENTITIES_TYPE.PLAYER && !this.dead) {
            if (triggered) {
                if (player.canUse(activator)) {
                    const item = player.useItem(activator)
                    this.activated = true
                    this.hideMessage()
                    player.hideHint()
                    if (kill) {
                        world.getObjectById(kill, LAYERS.OBJECTS).kill()
                    }
                    if (related) {
                        const rel = world.getObjectById(related, LAYERS.OBJECTS)
                        if (follow) {
                            camera.setFollow(rel)
                            this._scene.startTimeout({
                                name: 'wait_for_camera',
                                duration: 300
                            }, () => {
                                rel.activated = true
                                rel.trigger = this
                                rel.activator = item
                                this._scene.startTimeout({
                                    name: 'wait_for_player',
                                    duration: 2500
                                }, () => {
                                    overlay.fadeIn()
                                    camera.setFollow(player)
                                })
                            })
                        }
                        else {
                            rel.activated = true
                            rel.trigger = this
                            rel.activator = item
                        }
                    }
                }
                else {
                    const item = world.getObjectByProperty('id', activator, LAYERS.OBJECTS)
                    if (item) {
                        anchor_hint
                            ? this.showHint(item)
                            : player.showHint(item)
                    }
                    this.hideMessage()
                }
            }
            else if (hint && !player.hintTimeout) {
                const [x, y] = [
                    offsetX ? this.x + parseFloat(offsetX) * world.spriteSize : this.x,
                    offsetY ? this.y + parseFloat(offsetY) * world.spriteSize : this.y
                ]
                this.showMessage(hint, x, y)
            }
        }
    }

    update () {
        if (this.activated) {
            const { camera, overlay } = this._scene
            const { clear, fade, modify, produce, shake } = this.properties

            if (produce) {
                this.addItem(this.properties, this.x + 16, this.y + 16)
            }
            if (modify) {
                const matrix = JSON.parse(modify)
                if (matrix.length) {
                    matrix.map(
                        ([x, y, id]) => {
                            this._scene.addTile(x, y, id, LAYERS.MAIN)
                        }
                    )
                }
            }
            if (clear) {
                // clearInRange(world.getObjects(LAYERS.OBJECTS), this)
                this.clearTiles(clear)
            }
            shake && camera.shake()
            fade && overlay.fadeIn()
            this.dead = true
        }
    }

    clearTiles (layer) {
        const { world } = this._scene
        const { spriteSize } = world
        for (let x = 0; x < Math.round(this.width / spriteSize); x++) {
            for (let y = 0; y < Math.round(this.height / spriteSize); y++) {
                world.clearTile(
                    Math.round((this.x + (x * spriteSize)) / spriteSize),
                    Math.round((this.y + (y * spriteSize)) / spriteSize),
                    layer
                )
            }
        }
    }
}
