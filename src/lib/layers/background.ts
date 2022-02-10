import { Layer } from 'platfuse'
import { LAYERS } from '../constants'

export default class Background extends Layer {
    id = LAYERS.CUSTOM_BACKGROUND
    scroll = 0

    draw(): void {
        const { game } = this
        const { ctx, resolution } = game
        const { camera } = game.getCurrentScene()
        const bg1 = game.getImage('bg1.png')
        const bg2 = game.getImage('bg2.png')
        const moon = game.getImage('moon.png')
        const clouds = game.getImage('clouds.png')
        const s = camera.pos.x / 1.5
        const w1 = bg2.width - 1
        const x1 = s + Math.round((-s + camera.focus.x) / w1) * w1
        const y1 = 365 + camera.pos.y
        const w2 = clouds.width - 1
        const x2 = camera.pos.x / 8 + this.scroll
        const y2 = -30 + camera.pos.y / 4

        this.scroll = this.scroll < w2 ? this.scroll + 0.1 : 0

        ctx.drawImage(bg1, 0, -16 + camera.pos.y / 16)
        ctx.drawImage(moon, resolution.x - 70, 6)
        ctx.drawImage(clouds, x2 - w2, y2)
        ctx.drawImage(clouds, x2, y2)
        ctx.drawImage(bg2, x1 - w1, y1)
        ctx.drawImage(bg2, x1, y1)
    }
}
