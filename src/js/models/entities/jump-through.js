import Entity from '../entity'
import { ENTITIES, ENTITIES_FAMILY } from '../../lib/utils'

export default class JumpThrough extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.solid = false
        this.visible = false
        this.family = ENTITIES_FAMILY.MODIFIERS
    }

    collide (element) {
        const { input, player } = this._game
        if (element.force.y > 0 && element.y + element.height <= this.y + this.height) {
            element.y = this.y - element.height
            element.force.y = this.y - element.y - element.height
            element.onFloor = true
            element.doJump = false
            element.fall = false

            if (element.type === ENTITIES.PLAYER) {
                if (input.down) {
                    player.y += this.height
                }
            }
        }
    }
}
