import { Layer } from 'tiled-platformer-lib'
import { IMAGES, LAYERS } from '../constants'

export default class Background extends Layer {
    public id = LAYERS.CUSTOM_BACKGROUND

    draw (ctx: CanvasRenderingContext2D, scene: TPL.Scene): void {
        const { images, camera, viewport: { resolutionX }} = scene

        ctx.drawImage(images[IMAGES.BG1], 0, -16 + camera.y / 16)
        ctx.drawImage(images[IMAGES.MOON], resolutionX - 70, 6)
        ctx.drawImage(images[IMAGES.CLOUDS], camera.x / 8, -24 + camera.y / 4)

        // parallax background
        const s = camera.x / 1.5 
        const w = images[IMAGES.BG2].width
        const x = s + Math.round((-s + camera.focusPoint.x) / w) * w
        const y = 252 + camera.y / 1.5

        ctx.drawImage(images[IMAGES.BG2], x - w, y)
        ctx.drawImage(images[IMAGES.BG2], x, y)
    }
}
