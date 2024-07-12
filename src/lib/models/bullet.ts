import { Color, Entity, vec2 } from 'platfuse'
import { ObjectTypes } from '../constants'

export default class Bullet extends Entity {
    type = ObjectTypes.Bullet
    mass = 0.5
    maxSpeed = 3
    gravityScale = 0
    size = vec2(0.25, 0.08)
    color = new Color(255, 220, 220)
    ttl = 1

    collideWithObject() {
        this.destroy()
        return true
    }
}
