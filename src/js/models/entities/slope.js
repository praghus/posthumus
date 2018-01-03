import SAT from 'sat'
import Entity from '../entity'
import { ENTITIES_TYPE } from '../../lib/constants'

export default class Slope extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.solid = false
        this.visible = false
        if (this.type === ENTITIES_TYPE.SLOPE_RIGHT) {
            this.vectorMask = [
                new SAT.Vector(0, this.height),
                new SAT.Vector(0, 0),
                new SAT.Vector(this.width, 0)
            ]
        }
        else {
            this.vectorMask = [
                new SAT.Vector(0, 0),
                new SAT.Vector(this.width, 0),
                new SAT.Vector(this.width, this.height)
            ]
        }
    }

    collide (element) {
        if (!this.dead && element.solid) {
            const { input } = this._game
            const { x, width, height } = element
            const expectedY = this.type === ENTITIES_TYPE.SLOPE_RIGHT
                ? (this.y - height) + this.height - (((x + width) - this.x) * (this.height / this.width))
                : (this.y - height) + (x - this.x) * (this.height / this.width)

            if (element.y >= expectedY && !element.jump) {
                element.y = expectedY
                element.force.y = 0
                element.fall = false
                element.onFloor = true
            }
            else if (element.force.y === 0) {
                element.force.y += 1
            }

            if (element.type === ENTITIES_TYPE.PLAYER && input.up) {
                element.doJump = true
            }
        }
    }
}
