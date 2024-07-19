import { Scene, vec2 } from 'platfuse'
import Background from '../layers/background'
import Logo from '../models/logo'

export default class IntroScene extends Scene {
    init() {
        this.setScale(6)
        this.addLayer(Background)
        this.addObject(new Logo(this))
        this.camera.setPos(vec2(0, -900))
    }

    update() {
        if (this.game.input.keyIsDown('Space')) {
            this.game.playScene('MainScene')
        }
    }
}
