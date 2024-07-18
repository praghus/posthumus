import { Entity, vec2 } from 'platfuse'

export default class Logo extends Entity {
    image = 'logo.png'
    size = vec2(212 / this.scene.tileSize.x, 72 / this.scene.tileSize.y).divide(1.5) // 212 x 72
    solid = false
    mass = 0
    ttl = 5
}
