import { Entity, Game, Vec2 } from 'platfuse'
import { StringTMap } from '../types'
import { DIRECTIONS, ENTITY_TYPES, LAYERS, ENTITY_FAMILY } from '../constants'
import ANIMATIONS from '../animations/bat'
import MainScene from '../scenes/main'
import { dropItem } from './item'
import Player from './player'
import Bullet from './bullet'

const { LEFT, RIGHT } = DIRECTIONS

enum STATES {
    IDLE = 0,
    FLYING = 1,
    HURT = 2,
    FALL = 3
}

export default class Bat extends Entity {
    image = 'bat.png'
    family = ENTITY_FAMILY.ENEMIES
    layerId = LAYERS.OBJECTS
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    direction = LEFT
    activated = false
    collisions = true
    damage = 0
    energy = [10, 10]
    state = STATES.IDLE

    update(game: Game): void {
        super.update(game)
        const scene = game.getCurrentScene() as MainScene
        const player = scene.getObjectByType(ENTITY_TYPES.PLAYER)
        if (player) {
            switch (this.state) {
                case STATES.IDLE:
                    if (this.onScreen(game)) {
                        this.activated = true
                        this.animate(ANIMATIONS.IDLE)
                        game.wait(`bat-${this.id}-awake`, () => (this.state = STATES.FLYING), 1000)
                    }
                    break
                case STATES.FLYING:
                    this.damage = 10
                    this.force.y += this.pos.y > player.pos.y + 24 ? -0.1 : 0.05
                    this.force.x = this.approach(this.force.x, this.direction === LEFT ? -1 : 1, 0.1)
                    if (this.expectedPos.x !== this.pos.x) {
                        this.force.x *= -0.6
                        this.force.y -= 0.05
                        this.direction = this.direction === RIGHT ? LEFT : RIGHT
                    }
                    this.animate(this.direction === RIGHT ? ANIMATIONS.RIGHT : ANIMATIONS.LEFT)
                    break
                case STATES.HURT:
                    this.animate(this.direction === RIGHT ? ANIMATIONS.RIGHT : ANIMATIONS.LEFT)
                    break
                case STATES.FALL:
                    this.damage = 0
                    this.force.x = 0
                    this.force.y += 0.2
                    this.animate(ANIMATIONS.FALL)
                    if (this.onGround()) {
                        dropItem(scene, new Vec2(this.pos.x + this.width / 2, this.pos.y - 16))
                        this.kill()
                    }
                    break
            }
        }
    }
    hit(damage: number): void {
        this.energy[0] -= damage
        this.force.x *= -1
        if (this.energy[0] <= 0) {
            this.state = STATES.FALL
        }
    }
    collide(obj: Entity, game: Game) {
        if (this.activated && obj.visible) {
            switch (obj.type) {
                case ENTITY_TYPES.BULLET:
                    const bullet = obj as Bullet
                    this.hit(bullet.damage)
                    break
                case ENTITY_TYPES.PLAYER:
                    const player = obj as Player
                    player.hit(this.damage, game)
                    break
            }
        }
    }
    turnAround() {
        this.direction = this.direction === RIGHT ? LEFT : RIGHT
        this.force.x *= -0.6
    }
}
