import { Layer } from 'platfuse'
import MainScene from '../scenes/main-scene'

export default class Background extends Layer {
    name = 'Custom.Background'
    scroll = 0

    draw() {
        const { camera, game } = this.scene as MainScene
        const { ctx, width, height } = game

        const bg = game.getImage('background.png')
        const moon = game.getImage('moon.png')
        const clouds = game.getImage('clouds.png')
        const flash = game.getSetting('flash')
        const s = camera.pos.x / 1.5
        const w1 = (bg.width - 1) * camera.scale
        const w2 = (clouds.width - 1) * camera.scale
        const x1 = s + Math.round(-s / w1) * w1
        const y1 = bg.height * 2.83 * camera.scale + camera.pos.y
        const x2 = camera.pos.x / 2 + this.scroll
        const y2 = camera.pos.y / 3.5

        const gradient = ctx.createRadialGradient(
            game.width - moon.width * camera.scale,
            game.height / 2,
            moon.width * camera.scale,
            game.width / 2,
            game.height / 2,
            game.height
        )

        gradient.addColorStop(0, game.backgroundColor.brightness(15).toString())
        gradient.addColorStop(0.7, game.backgroundColor.toString())
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(moon, width - 270, 10, moon.width * camera.scale, moon.height * camera.scale)
        ctx.drawImage(clouds, x2 - w2, y2, clouds.width * camera.scale, clouds.height * camera.scale)
        ctx.drawImage(clouds, x2, y2, clouds.width * camera.scale, clouds.height * camera.scale)
        ctx.drawImage(bg, x1 - w1, y1, bg.width * camera.scale, bg.height * camera.scale)
        ctx.drawImage(bg, x1, y1, bg.width * camera.scale, bg.height * camera.scale)
        ctx.fillStyle = flash ? '#ffffff88' : game.primaryColor.toString()
        flash && ctx.fillRect(0, 0, width, height)
        this.scroll = this.scroll < w2 ? this.scroll + 0.5 : 0
    }
}
