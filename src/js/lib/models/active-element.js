import Entity from './entity'

export default class ActiveElement extends Entity {
    constructor (obj, scene) {
        super(obj, scene)
        this.activated = false
        this.visible = true
    }

    draw () {
        const {
            addLightElement,
            addLightmaskElement,
            camera,
            debug,
            dynamicLights,
            overlay
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
}
