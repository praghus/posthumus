import Entity from '../entity'
import { ENTITIES_TYPE } from '../../lib/constants'

export default class Coin extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.width = 8
        this.height = 8
        this.animation = {x: 0, y: 0, w: 8, h: 8, frames: 10, fps: 30, loop: true}
        this.force = {x: 0, y: -5}
    }

    collide (element) {
        const { player } = this._game
        if (element.type === ENTITIES_TYPE.PLAYER) {
            this.dead = true
            player.coinCollect += 1
        }
    }

    update () {
        const { gravity } = this._game.world
        if (this.onScreen()) {
            this.animate()
            this.force.y += gravity
            this.move()
        }
    }
}
