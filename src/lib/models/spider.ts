import { Entity, Game, Vector } from 'platfuse'
import { COLORS, ENTITY_FAMILY, ENTITY_TYPES, LAYERS } from '../constants'
import ANIMATIONS from '../animations/spider'
import MainScene from '../scenes/main'
import Bullet from './bullet'
import Player from './player'

export default class Spider extends Entity {
    image = 'spider.png'
    family = ENTITY_FAMILY.ENEMIES
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    collisions = true
    fall = false
    rise = false
    startPos: Vector
    energy = [20, 20]
    damage = 10

    constructor(obj: Record<string, any>, game: Game) {
        super(obj, game)
        this.startPos = new Vector(obj.x + obj.width / 2, obj.y)
    }

    draw() {
        const { camera } = this.game.getCurrentScene()
        const { ctx } = this.game
        ctx.beginPath()
        ctx.strokeStyle = COLORS.SPIDER_WEB
        ctx.moveTo(this.startPos.x + camera.pos.x, this.startPos.y + camera.pos.y)
        ctx.lineTo(this.startPos.x + camera.pos.x, this.pos.y + camera.pos.y)
        ctx.stroke()
        this.collisions && super.draw()
    }

    update() {
        if (this.onScreen()) {
            super.update()
            const { gravity } = this.game.getCurrentScene() as MainScene

            if (this.rise) this.force.y = -1
            else if (this.fall) this.force.y += gravity
            else this.force.y = 0

            if (this.energy[0] <= 0) {
                this.damage = 0
                this.rise = false
                this.fall = false
                this.collisions = false
                this.game.cancelWait(`spider-${this.id}-fall`)
            } else {
                if (this.onGround() && this.fall) {
                    this.fall = false
                    this.rise = true
                }
                if (this.pos.y <= this.startPos.y) {
                    this.rise = false
                    this.fall = false
                    this.game.wait(`spider-${this.id}-fall`, () => (this.fall = true), 500)
                }
            }
            this.animate(ANIMATIONS.DEFAULT)
        }
    }

    hit(damage: number) {
        this.energy[0] -= damage
    }

    collide(obj: Entity) {
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
