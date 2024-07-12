import { Entity, vec2 } from 'platfuse'
import { ObjectTypes } from '../constants'

export default class Item extends Entity {
    type = ObjectTypes.Item
    mass = 0.1
    size = vec2(1)
    elasticity = 0.7
    gravityScale = 0.3

    collideWithObject(entity: Entity): boolean {
        return entity.type === ObjectTypes.Player
    }
}
