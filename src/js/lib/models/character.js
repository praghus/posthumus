import GameEntity from './game-entity'

export default class Character extends GameEntity {
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
}
