import { Entity, vec2 } from 'platfuse'

export default class Logo extends Entity {
    image = 'logo.png'
    solid = false
    mass = 0

    update(): void {
        const { game, camera, tileSize } = this.scene
        const s = game.width / camera.scale / 1.3
        this.pos = vec2(game.width / camera.scale / tileSize.x / 2, 366)
        this.size = vec2(s, s / 2.9)
    }

    draw() {
        super.draw()
        const { width, height } = this.scene.game
        const scale = Math.min(width / this.scene.tileSize.x / 225, 3)
        this.scene.game.draw.pixelText('Press spacebar to start...', vec2(width / 2, height - 80), scale, 'center')
    }
}
