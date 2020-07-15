import { Layer } from 'tiled-platformer-lib'
import { COLORS, LAYERS } from '../constants'

export default class Flash extends Layer {
    public id = LAYERS.FLASH

    draw (ctx: CanvasRenderingContext2D, scene: TPL.Scene): void {
        const { viewport: { resolutionX, resolutionY }} = scene
        if (scene.checkTimeout('player-shoot-flash')) {
            ctx.fillStyle = COLORS.FLASH
            ctx.fillRect(0, 0, resolutionX, resolutionY)
        }
    }
}
