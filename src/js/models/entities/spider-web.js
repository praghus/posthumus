import Entity from '../entity'
import { ENTITIES_TYPE } from '../../lib/constants'

export default class SpiderWeb extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.width = 32
        this.height = 48
        this.duration = 2000
        this.durationTimeout = null
    }

    collide (element) {
        const { player } = this._game
        if (element.type === ENTITIES_TYPE.PLAYER && player.canMove) {
            player.freeze(this.duration)
        }
    }

    update () {
        const { player } = this._game
        if (!this.awake) {
            this.durationTimeout = setTimeout(() => {
                this.dead = true
            }, this.duration)
            this.awake = true
        }
        this.x = player.x
        this.y = player.y
    }
}
