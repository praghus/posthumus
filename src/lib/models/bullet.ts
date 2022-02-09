import { Entity, Game, Scene } from 'platfuse'
import { createParticles, PARTICLES } from './particle'
import { DIRECTIONS, ENTITY_TYPES, ENTITY_FAMILY, LAYERS } from '../constants'
import ANIMATIONS from '../animations/dust'
import { StringTMap } from '../types'

export default class Bullet extends Entity {
    image = 'bullet.png'
    animations = ANIMATIONS
    direction = DIRECTIONS.RIGHT
    type = ENTITY_TYPES.BULLET
    layerId = LAYERS.OBJECTS
    particle = PARTICLES.RUBBLE
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    collisions = true
    width = 8
    height = 8
    damage = 10

    constructor(obj: StringTMap<any>, game: Game) {
        super(obj, game)
        this.direction = obj.direction
        this.setCollisionArea(4, 2, 4, 2)
    }
    collide(obj: Entity) {
        if (obj.collisions) {
            if (obj.family === ENTITY_FAMILY.ENEMIES) {
                this.particle = PARTICLES.BLOOD
                this.explode()
            }
        }
    }
    explode(): void {
        createParticles(this.game, this.pos, this.particle)
        this.kill()
    }
    update() {
        super.update()
        if (!this.onScreen() || this.pos.x !== this.expectedPos.x) this.explode()
        this.force.x = this.approach(this.force.x, this.direction === DIRECTIONS.LEFT ? -10 : 10, 5)
        this.flips = { H: this.direction === DIRECTIONS.LEFT }
    }
}
