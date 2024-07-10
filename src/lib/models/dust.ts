import { Entity, vec2 } from 'platfuse'
import { ObjectTypes } from '../constants'
import Animations from '../animations/dust'

export default class Dust extends Entity {
    image = 'dust.png'
    type = ObjectTypes.Dust
    animation = Animations.Dust
    size = vec2(0.5, 0.5)
    collideObjects = false
    collideTiles = false
    solid = false
    mass = 0
    ttl = 0.5
}
