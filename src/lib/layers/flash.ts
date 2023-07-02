import { Layer } from 'platfuse'
import { COLORS, LAYERS } from '../constants'
import MainScene from '../scenes/main'

export default class Flash extends Layer {
    id = LAYERS.FLASH

    draw() {
        const { ctx, resolution } = this.game
        const scene = this.game.getCurrentScene() as MainScene
        if (scene.flash) {
            ctx.fillStyle = COLORS.FLASH
            ctx.fillRect(0, 0, resolution.x, resolution.y)
        }
    }
}
