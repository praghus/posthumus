import Overlay from '../models/overlay'
import { Scene } from 'tmx-platformer-lib'
import { isMobileDevice } from '../../lib/utils/helpers'
import { ASSETS, INPUTS, SCENES } from '../../lib/constants'

export default class IntroScene extends Scene {
    constructor (game) {
        super(game)
        this.overlay = new Overlay(this)
        this.scroll = 0
        this.fade = 1
        this.loaded = true
        this.overlay.fadeIn()
    }

    onUpdate () {
        if (this.fetchInput(INPUTS.INPUT_ACTION)) {
            this.onKey(INPUTS.INPUT_ACTION, false)
            this.setScene(SCENES.GAME)
        }
    }

    render () {
        const { ctx, assets, overlay, viewport } = this
        const { resolutionX, resolutionY } = viewport

        if (this.scroll === 255) {
            this.scroll = 0
        }

        ctx.drawImage(assets[ASSETS.BG1], 0, 0)
        ctx.drawImage(assets[ASSETS.MOON], (resolutionX / 2) - 30, 16)
        ctx.drawImage(assets[ASSETS.BG2], this.scroll -= 0.1, -80)
        ctx.drawImage(assets[ASSETS.LOGO], (resolutionX / 2) - 106, (resolutionY / 2) - 44)

        overlay.displayText(
            isMobileDevice()
                ? '    TAP TO BEGIN    '
                : 'PRESS SPACE TO BEGIN',
            Math.ceil(resolutionX / 2) - 50,
            resolutionY - 10
        )
        overlay.update()
    }
}
