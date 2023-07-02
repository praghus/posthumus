import { Layer } from 'platfuse'
import { COLORS, ENTITY_TYPES, LAYERS } from '../constants'

export default class Overlay extends Layer {
    id = LAYERS.CUSTOM_OVERLAY
    darkOverlay = 1
    fadeSpeed = 1
    fadeTo = 0

    update() {
        const d = this.darkOverlay
        const delta = this.game.delta
        if (d !== 0 && ((d < 0 && d + delta < 0) || (d > 0 && d - delta > 0))) {
            this.darkOverlay += delta * this.fadeSpeed * (d < 0 ? 1 : -1)
        }
    }

    draw() {
        const game = this.game
        const { ctx, resolution } = game
        const scene = game.getCurrentScene()
        const write = game.draw.createPixelFontRenderer(game.getImage('font.png'), 5, 16)
        const player: any = scene.getObjectByType(ENTITY_TYPES.PLAYER)
        const energy = (player.energy[0] / 10) * 4
        const [ammo, maxAmmo] = player.ammo

        ctx.drawImage(game.getImage('estrip.png'), 2, 2)
        ctx.drawImage(game.getImage('energy.png'), 0, 0, energy, 4, 18, 5, energy, 4)

        write('AMMO', resolution.x - 25 - maxAmmo * 3, resolution.y - 9)
        for (let i = 0; i < maxAmmo; i++) {
            ctx.drawImage(
                game.getImage('ammo.png'),
                i < ammo ? 0 : 3,
                0,
                4,
                8,
                resolution.x - 7 - i * 3,
                resolution.y - 11,
                4,
                8
            )
        }
        if (Math.abs(this.darkOverlay) !== this.fadeTo) {
            ctx.save()
            ctx.fillStyle = COLORS.BLACK
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
