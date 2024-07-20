import { Layer } from 'platfuse'
import MainScene from '../scenes/main-scene'

export default class Background extends Layer {
    name = 'Custom.Background'
    bg = this.scene.game.getImage('background.png')
    moon = this.scene.game.getImage('moon.png')
    clouds = this.scene.game.getImage('clouds.png')
    scroll = 0

    draw() {
        const { camera, game } = this.scene as MainScene
        const { ctx, width, height } = game

        const flash = game.getSetting('flash')
        const s = camera.pos.x * 0.5
        const w1 = (this.bg.width - 1) * camera.scale
        const w2 = (this.clouds.width - 1) * camera.scale
        const x1 = s + Math.round(-s / w1) * w1
        const y1 = this.bg.height * 2.8 * camera.scale + camera.pos.y
        const x2 = camera.pos.x / 2 + this.scroll
        const y2 = 1000 + camera.pos.y * 0.8

        const gradient = ctx.createRadialGradient(game.width - 240, 180, 15, game.width - 240, 180, width)
        const gradient2 = ctx.createLinearGradient(0, y1 + (this.bg.height / 1.6) * camera.scale, 0, height)
        gradient.addColorStop(0, game.backgroundColor.brightness(50).toString())
        gradient.addColorStop(0.7, game.backgroundColor.toString())
        gradient2.addColorStop(0, '#161616')
        gradient2.addColorStop(1, '#000000')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(this.moon, width - 420, 20, this.moon.width * camera.scale, this.moon.height * camera.scale)
        ctx.drawImage(this.clouds, x2 - w2, y2, this.clouds.width * camera.scale, this.clouds.height * camera.scale)
        ctx.drawImage(this.clouds, x2, y2, this.clouds.width * camera.scale, this.clouds.height * camera.scale)
        ctx.drawImage(this.bg, x1 - w1, y1, this.bg.width * camera.scale, this.bg.height * camera.scale)
        ctx.drawImage(this.bg, x1, y1, this.bg.width * camera.scale, this.bg.height * camera.scale)
        ctx.fillStyle = gradient2
        ctx.fillRect(0, y1 + (this.bg.height / 1.6) * camera.scale, width, height)
        ctx.fillStyle = flash ? '#ffffffaa' : game.primaryColor.toString()
        flash && ctx.fillRect(0, 0, width, height)
    }

    update() {
        this.scroll = this.scroll < (this.clouds.width - 1) * this.scene.camera.scale ? this.scroll + 0.3 : 0
    }
}
