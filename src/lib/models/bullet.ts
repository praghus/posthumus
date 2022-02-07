import { Entity, Game, Scene } from 'platfuse'
import { createParticles, PARTICLES } from './particle'
import { DIRECTIONS, ENTITY_TYPES, ENTITY_FAMILY, LAYERS } from '../constants'
import ANIMATIONS from '../animations/dust'
import MainScene from '../scenes/main'
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

    constructor(obj: StringTMap<any>) {
        super(obj)
        this.direction = obj.direction
    }

    collide(obj: Entity, game: Game) {
        if (obj.collisions) {
            if (obj.family === ENTITY_FAMILY.ENEMIES) {
                this.particle = PARTICLES.BLOOD
                this.explode(game)
            }
        }
    }

    explode(game: Game): void {
        const scene = game.getCurrentScene() as MainScene
        createParticles(scene, this.pos, this.particle)
        this.kill()
    }

    update(game: Game) {
        super.update(game)
        if (!this.onScreen(game) || this.pos.x !== this.expectedPos.x) {
            this.explode(game)
        }
        this.force.x = this.approach(this.force.x, this.direction === DIRECTIONS.LEFT ? -10 : 10, 5)
        this.flips = { H: this.direction === DIRECTIONS.LEFT }
    }
}
