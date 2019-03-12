import { Entity } from 'tmx-platformer-lib'
import { randomInt } from '../../lib/helpers'
import { TIMEOUTS, LAYERS } from '../../lib/constants'
import { ENTITIES_TYPE } from '../../lib/entities'

export default class ActiveElement extends Entity {
    constructor (obj, scene) {
        super(obj, scene)
        this.activated = false
        this.visible = true
        this.messageDuration = 4000

        this.hideMessage = () => {
            this.message = null
        }

        this.hideHint = () => {
            this.hint = null
        }
    }

    draw () {
        const {
            addLightElement, addLightmaskElement, camera, debug, dynamicLights, overlay
        } = this._scene

        if (dynamicLights && this.visible && this.onScreen()) {
            const [ posX, posY ] = [
                Math.floor(this.x + camera.x),
                Math.floor(this.y + camera.y)
            ]

            this.lightmask && addLightmaskElement(this.lightmask, {
                x: posX,
                y: posY,
                width: this.width,
                height: this.height
            })

            this.light && addLightElement(
                posX + (this.width / 2),
                posY + (this.height / 2),
                this.light.distance,
                this.light.color
            )
        }

        super.draw()

        if (this.message) {
            const { text, x, y } = this.message
            overlay.displayText(text,
                Math.floor(x + camera.x),
                Math.floor(y + camera.y)
            )
        }
        this.hint && overlay.addHint(this)
        this.onScreen() && debug && overlay.displayDebug(this)
    }

    showHint (item) {
        if (!this._scene.checkTimeout(TIMEOUTS.HINT)) {
            this.hint = item.animation
            this._scene.startTimeout(TIMEOUTS.HINT, this.hideHint)
        }
    }

    showMessage (text) {
        const offsetX = this.properties && this.properties.offsetX || 0
        const offsetY = this.properties && this.properties.offsetY || 0
        const { world } = this._scene
        const [x, y] = [
            offsetX ? this.x + offsetX * world.spriteSize : this.x,
            offsetY ? this.y + offsetY * world.spriteSize : this.y
        ]
        if (!this._scene.checkTimeout(TIMEOUTS.MESSAGE)) {
            this.message = { text, x, y }
            this._scene.startTimeout(TIMEOUTS.MESSAGE, this.hideMessage)
        }
    }

    changeMessage (text, x = this.x, y = this.y) {
        this._scene.stopTimeout(TIMEOUTS.MESSAGE)
        this.message = { text, x, y }
        this._scene.startTimeout(TIMEOUTS.MESSAGE, this.hideMessage)
    }

    addItem (properties, x, y) {
        const { produce, produce_name, produce_gid } = properties
        this._scene.world.addObject({
            type: ENTITIES_TYPE.ITEM,
            visible: true,
            gid: produce_gid || null,
            name: produce_name || '',
            x: x || this.x,
            y: y || this.y,
            properties: { id: produce }
        }, LAYERS.OBJECTS)
    }

    emitParticles (count, properties) {
        const particle_count = count || 10
        for (let i = 0; i < particle_count; i++) {
            const props = {...properties}
            props.x = properties.x + randomInt(0, 8)
            this._scene.world.addObject({
                type: ENTITIES_TYPE.PARTICLE,
                ...props
            }, LAYERS.OBJECTS)
        }
    }
}
