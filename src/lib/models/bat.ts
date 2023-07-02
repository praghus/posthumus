import { Entity, Vec2 } from 'platfuse'
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
    FALL = 2
}

export default class Bat extends Entity {
    image = 'bat.png'
    family = ENTITY_FAMILY.ENEMIES
    layerId = LAYERS.OBJECTS
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    direction = LEFT
    activated = false
    collisions = true
    turning = false
    damage = 0
    energy = [10, 10]
    state = STATES.IDLE

    update() {
        super.update()
        const scene = this.game.getCurrentScene() as MainScene
        const player = scene.getObjectByType(ENTITY_TYPES.PLAYER) as Player
        switch (this.state) {
            case STATES.IDLE:
                if (this.onScreen()) {
                    this.activated = true
                    this.animate(ANIMATIONS.IDLE)
                    this.game.wait(`bat-${this.id}-awake`, () => (this.state = STATES.FLYING), 1000)
                }
                break
            case STATES.FLYING:
                this.damage = 10
                this.force.y += this.pos.y > player.pos.y + 24 ? -0.1 : 0.02
                this.force.x = this.approach(this.force.x, this.direction === LEFT ? -1 : 1, 0.1)
                if (
                    this.expectedPos.x !== this.pos.x ||
                    (this.pos.x <= Math.abs(scene.camera.pos.x) && this.direction === LEFT) ||
                    (this.pos.x >= Math.abs(scene.camera.pos.x - this.game.resolution.x) && this.direction === RIGHT)
                ) {
                    this.turnAround()
                }
                this.animate(this.direction === RIGHT ? ANIMATIONS.RIGHT : ANIMATIONS.LEFT)
                break
            case STATES.FALL:
                this.damage = 0
                this.force.x = 0
                this.force.y += 0.2
                this.animate(ANIMATIONS.FALL)
                if (this.onGround()) {
                    dropItem(this.game, new Vec2(this.pos.x + this.width / 2, this.pos.y - 16))
                    this.kill()
                }
                break
        }
    }

    hit(damage: number) {
        this.energy[0] -= damage
        this.force.x *= -1
        if (this.energy[0] <= 0) {
            this.state = STATES.FALL
        }
    }

    collide(obj: Entity) {
        if (obj.collisions) {
            switch (obj.type) {
                case ENTITY_TYPES.BULLET:
                    const bullet = obj as Bullet
                    this.hit(bullet.damage)
                    break
                case ENTITY_TYPES.PLAYER:
                    const player = obj as Player
                    player.hit(this.damage)
                    break
            }
        }
    }

    turnAround() {
        if (!this.turning) {
            this.turning = true
            this.force.x *= -0.6
            this.force.y -= 0.05
            this.direction = this.direction === RIGHT ? LEFT : RIGHT
            this.game.wait(`bat-${this.id}-turn`, () => (this.turning = false), 500)
        }
    }
}
