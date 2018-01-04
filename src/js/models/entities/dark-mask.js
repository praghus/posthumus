import Entity from '../entity'
import { LIGHTS } from '../../lib/constants'
import { overlap } from '../../lib/helpers'

export default class DarkMask extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.solid = false
        this.active = false
        this.activated = false
    }

    update () {
        const { elements, player } = this._game
        if (this.onScreen()) {
            if (overlap(player, this)) {
                this.active = true
                if (!this.activated) {
                    player.inDark += 1
                    const { light_color } = this.properties
                    if (light_color) {
                        elements.setLight(LIGHTS.PLAYER_LIGHT, light_color)
                    }
                    this.activated = true
                }
            }
            else {
                if (this.active) {
                    player.inDark -= 1
                    this.activated = false
                    this.active = false
                }
            }
        }
        else if (this.active) {
            player.inDark -= 1
            this.activated = false
            this.active = false
        }
    };

    draw (ctx) {
        const { assets, world, camera } = this._game
        const { spriteSize } = world
        const bordersX = Math.round(this.width / spriteSize) + 1
        const bordersY = Math.round(this.height / spriteSize) + 1

        if (this.onScreen() && !this.active) {
            for (let y = -1; y < bordersY; y++) {
                for (let x = -1; x < bordersX; x++) {
                    let frame = 0
                    if (x === -1) frame = 1
                    if (y === -1) frame = 3
                    if (x + 1 === bordersX) frame = 2
                    if (y + 1 === bordersY) frame = 0
                    if (
                        (x === -1 && y === -1) ||
                        (x === -1 && y + 1 === bordersY) ||
                        (x + 1 === bordersX && y === -1) ||
                        (x + 1 === bordersX && y + 1 === bordersY)
                    ) {
                        frame = 5
                    }
                    ctx.drawImage(assets[this.type],
                        frame * spriteSize, 0,
                        spriteSize, spriteSize,
                        Math.floor(this.x + camera.x) + (x * spriteSize),
                        Math.floor(this.y + camera.y) + (y * spriteSize),
                        spriteSize, spriteSize
                    )
                }
            }
        };
    }
}
