import ActiveElement from '../models/active-element'
import { randomChoice, randomInt } from '../../lib/helpers'
import { ENTITIES_TYPE } from '../../lib/entities'
import { DIRECTIONS, LAYERS } from '../../lib/constants'

export default class Lava extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.damage = 1000
        this.canShoot = true
        this.shootDelay = 1000
        this.shootTimeout = null
        this.animation = {x: 0, y: 0, w: 32, h: 48, frames: 4, fps: 4, loop: true}
    }

    draw () {
        const { assets, ctx, camera, world } = this._scene
        const { spriteSize } = world
        const y = 0
        for (let x = 0; x < Math.round((this.width / 2) / spriteSize); x++) {
            const PX = Math.round((this.x + (x * spriteSize)) / spriteSize)
            const PY = Math.round((this.y + (y * spriteSize)) / spriteSize)
            if (!world.isSolidArea(PX, PY)) {
                ctx.drawImage(assets[this.asset],
                    this.animation.x + this.animFrame * this.animation.w, this.animation.y,
                    this.animation.w, this.animation.h,
                    Math.floor(this.x + camera.x) + (x * this.animation.w),
                    Math.floor(this.y + camera.y) + (y * this.animation.h),
                    this.animation.w, this.animation.h
                )
            }
        }
    }

    update () {
        if (this.onScreen()) {
            this.canShoot && this.shoot()
            this.animate()
        }
    }

    shoot () {
        const { world } = this._scene

        world.addObject({
            type: ENTITIES_TYPE.LAVA_STONE,
            visible: true,
            direction: randomChoice([
                DIRECTIONS.LEFT,
                DIRECTIONS.RIGHT
            ]),
            force: {
                x: 0,
                y: -randomInt(4, 6)
            },
            x: this.x + randomInt(1, 8) * 16,
            y: this.y - 16
        }, LAYERS.OBJECTS)

        this.shootTimeout = setTimeout(() => {
            this.canShoot = true
        }, this.shootDelay)
        this.canShoot = false
    }
}
