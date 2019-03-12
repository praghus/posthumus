import Overlay from '../models/overlay'
import { Scene } from 'tmx-platformer-lib'
import { isMobileDevice } from '../../lib/helpers'
import { COLORS, INPUTS, SCENES } from '../../lib/constants'

export default class IntroScene extends Scene {
    constructor (game) {
        super(game)
        this.overlay = new Overlay(this)
        this.loaded = true
    }

    onUpdate () {
        if (this.fetchInput(INPUTS.INPUT_SHOT) || this.fetchInput(INPUTS.INPUT_UP)) {
            this.setScene(SCENES.GAME)
        }
    }

    render () {
        const { ctx, overlay, viewport } = this
        const { resolutionX, resolutionY } = viewport

        ctx.fillStyle = COLORS.BLUE_SKY
        ctx.fillRect(0, 0, resolutionX, resolutionY)

        overlay.displayText(isMobileDevice()
            ? '    TAP TO BEGIN    '
            : 'PRESS SPACE TO BEGIN',
        Math.ceil(resolutionX / 2) - 50, resolutionY - 10)
    }
}
