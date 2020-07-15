import { Layer } from 'tiled-platformer-lib'
import { IMAGES, LAYERS } from '../constants'

export default class Background extends Layer {
    public id = LAYERS.CUSTOM_BACKGROUND

    draw (ctx: CanvasRenderingContext2D, scene: TPL.Scene): void {
        const { images, camera, viewport: { resolutionX }} = scene
        ctx.drawImage(images[IMAGES.BACKGROUND], 0, 0)
        ctx.drawImage(images[IMAGES.MOON], resolutionX - 70, 6)
        ctx.drawImage(images[IMAGES.CLOUDS], (camera.x / 8), -50 + (camera.y / 16))
    }
}
