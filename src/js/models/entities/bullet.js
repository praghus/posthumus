import Entity from '../entity'
// import { brighten, rgbToHex } from '../../lib/utils/helpers'
import { DIRECTIONS, ENTITIES_FAMILY } from '../../lib/utils/constants'

export default class Bullet extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.width = 8
        this.height = 1
        this.speed = 10
        this.maxSpeed = 10
        this.damage = 10
        this.color = '#666666'
        this.family = ENTITIES_FAMILY.BULLETS
    }

    collide (element) {
        if (element.solid) {
            // const { ctx, camera } = this._game
            // const EX = this.x
            // const EY = this.y
            // const BX = this.direction === DIRECTIONS.RIGHT
            //     ? EX + this.speed
            //     : EX - this.speed
            // const p = ctx.getImageData(BX + camera.x, EY + camera.y, 1, 1).data
            this.dead = true
            this.color = '#000000' // brighten('#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6), 20)
            this._game.shootExplosion(this.x, this.y, this.color)
        }
    }

    update () {
        if (!this.dead) {
            this.force.x += this.direction === DIRECTIONS.RIGHT
                ? this.speed
                : -this.speed

            this.move()

            if (this.expectedX !== this.x) {
                this.dead = true
            }
            if (this.dead) {
                this._game.shootExplosion(this.x, this.y, this.color)
            }
        }
    }
}
