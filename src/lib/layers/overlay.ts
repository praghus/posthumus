import { Layer } from 'platfuse'
import Player from '../models/player'
import { ObjectTypes } from '../constants'

export default class Overlay extends Layer {
    name = 'Overlay'

    draw() {
        const { camera, game } = this.scene
        const { scale } = camera
        const { ctx } = game

        const resolution = game.getResolution()

        const player = this.scene.getObjectByType(ObjectTypes.Player) as Player

        // const write = game.draw.createPixelFontRenderer(game.getImage('font.png'), 5, 16)
        const energy = (player.health[0] / 10) * 4
        const [ammo, maxAmmo] = player.ammo

        const healthStrip = game.getImage('estrip.png')
        const healthBar = game.getImage('energy.png')

        ctx.drawImage(healthStrip, 2 * scale, 2 * scale, healthStrip.width * scale, healthStrip.height * scale)
        ctx.drawImage(healthBar, 0, 0, energy, 4, 18 * scale, 5 * scale, energy * scale, 4 * scale)

        // write('AMMO', resolution.x - 25 - maxAmmo * 3, resolution.y - 9)
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
    }
}
