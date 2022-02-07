import { Game, Layer } from 'platfuse'
import { COLORS, LAYERS } from '../constants'
import MainScene from '../scenes/main'

export default class Flash extends Layer {
    id = LAYERS.FLASH

    draw(game: Game): void {
        const { ctx, resolution } = game
        const scene = game.getCurrentScene() as MainScene
        if (scene.flash) {
            ctx.fillStyle = COLORS.FLASH
            ctx.fillRect(0, 0, resolution.x, resolution.y)
        }
    }
}
