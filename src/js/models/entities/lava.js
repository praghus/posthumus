import Entity from '../entity'
import { ENTITIES_TYPE } from '../../lib/constants'

export default class Lava extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.damage = 1000
        this.canShoot = true
        this.shootDelay = 1000
        this.shootTimeout = null
        this.animation = {x: 0, y: 0, w: 16, h: 16, frames: 4, fps: 4, loop: true}
    }

    draw (ctx) {
        const { assets, camera, world } = this._game
        const { spriteSize } = world
        for (let y = 0; y < Math.round(this.height / spriteSize); y++) {
            for (let x = 0; x < Math.round(this.width / spriteSize); x++) {
                const PX = Math.round((this.x + (x * spriteSize)) / spriteSize)
                const PY = Math.round((this.y + (y * spriteSize)) / spriteSize)
                if (!this._game.world.isSolid(PX, PY)) {
                    ctx.drawImage(assets[this.type],
                        this.animFrame * spriteSize, y === 0 ? y : spriteSize,
                        spriteSize, spriteSize,
                        Math.floor(this.x + camera.x) + (x * spriteSize),
                        Math.floor(this.y + camera.y) + (y * spriteSize),
                        spriteSize, spriteSize
                    )
                }
            }
        }
    }

    update () {
        if (this.onScreen()) {
            if (this.canShoot) {
                this.shoot()
            }
            this.animate()
        }
    }

    shoot () {
        const { elements } = this._game
        elements.add({
            type: ENTITIES_TYPE.LAVA_STONE,
            x: this.x + Math.random() * this.width,
            y: this.y
        })
        this.shootTimeout = setTimeout(() => {
            this.canShoot = true
        }, this.shootDelay)
        this.canShoot = false
    }
}
