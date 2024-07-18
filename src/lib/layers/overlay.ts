import { Layer } from 'platfuse'
import Player from '../models/player'
import { ObjectTypes } from '../constants'

export default class Overlay extends Layer {
    name = 'Overlay'
    darkOverlay = 1
    fadeSpeed = 1
    fadeTo = 0

    update() {
        const d = this.darkOverlay
        const delta = this.scene.game.delta
        if (d !== 0 && ((d < 0 && d + delta < 0) || (d > 0 && d - delta > 0))) {
            this.darkOverlay += delta * this.fadeSpeed * (d < 0 ? 1 : -1)
        }
    }

    draw() {
        const { camera, game } = this.scene
        const { scale } = camera
        const { ctx } = game

        const resolution = game.getResolution()
        const healthStrip = game.getImage('estrip.png')
        const healthBar = game.getImage('energy.png')
        const player = this.scene.getObjectByType(ObjectTypes.Player) as Player
        const energy = player.health[0] * 4
        const [ammo, maxAmmo] = player.ammo

        ctx.drawImage(healthStrip, 2 * scale, 2 * scale, healthStrip.width * scale, healthStrip.height * scale)
        ctx.drawImage(healthBar, 0, 0, energy, 4, 18 * scale, 5 * scale, energy * scale, 4 * scale)

        for (let i = 0; i < maxAmmo; i++) {
            ctx.drawImage(
                game.getImage('ammo.png'),
                i < ammo ? 0 : 3,
                0,
                4,
                8,
                resolution.x - 7 * scale - i * 3 * scale,
                resolution.y - 11 * scale,
                4 * scale,
                8 * scale
            )
        }

        if (Math.abs(this.darkOverlay) !== this.fadeTo) {
            ctx.save()
            ctx.fillStyle = 'black'
            ctx.globalAlpha = (this.darkOverlay < 0 ? 1 : 0) + this.darkOverlay
            ctx.fillRect(0, 0, resolution.x + 1, resolution.y + 1)
            ctx.restore()
        }
    }

    fadeIn() {
        this.darkOverlay = 1
        this.fadeTo = 0
    }

    fadeOut() {
        this.darkOverlay = -1
        this.fadeTo = 1
    }
}
