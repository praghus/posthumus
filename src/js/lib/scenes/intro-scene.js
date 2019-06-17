import Overlay from '../models/overlay'
import { Game } from 'tiled-platformer-lib'
import { isMobileDevice } from '../../lib/utils/helpers'
import { ASSETS, INPUTS, SCENES } from '../../lib/constants'

export default class IntroScene extends Game {
    constructor (ctx, props) {
        super(ctx, props)
        this.overlay = new Overlay(this)
        this.scroll = 0
        this.fade = 1
        this.loaded = true
        this.overlay.fadeIn()
    }

    onUpdate () {
        const {
            input,
            onKey,
            setScene
        } = this.props
        if (input.keyPressed[INPUTS.INPUT_ACTION]) {
            onKey(INPUTS.INPUT_ACTION, false)
            setScene(SCENES.GAME)
        }
    }

    render () {
        const {
            ctx,
            props: {
                assets,
                viewport: {
                    resolutionX,
                    resolutionY
                }
            }
        } = this

        if (this.scroll === 255) {
            this.scroll = 0
        }

        ctx.drawImage(assets[ASSETS.BG1], 0, 0)
        ctx.drawImage(assets[ASSETS.MOON], (resolutionX / 2) - 30, 10)
        ctx.drawImage(assets[ASSETS.BG2], this.scroll -= 0.1, -80)
        ctx.drawImage(assets[ASSETS.LOGO], (resolutionX / 2) - 106, (resolutionY / 2) - 44)

        this.overlay.displayText(
            isMobileDevice()
                ? '    TAP TO BEGIN    '
                : 'PRESS SPACE TO BEGIN',
            Math.ceil(resolutionX / 2) - 50,
            resolutionY - 10
        )
        this.overlay.update()
    }
}
