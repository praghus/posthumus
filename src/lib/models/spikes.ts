import { Entity } from 'platfuse'
import { ENTITY_FAMILY, ENTITY_TYPES, LAYERS } from '../constants'
import { randomInt } from '../utils'
import ANIMATIONS from '../animations/shine'
import Player from './player'

export default class Spikes extends Entity {
    image = 'shine.png'
    animation = ANIMATIONS.DEFAULT
    family = ENTITY_FAMILY.TRAPS
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    collisions = true
    canAnimate = true
    damage = 1000
    shineX = 0

    draw() {
        const { ctx } = this.game
        const { camera } = this.game.getCurrentScene()
        const {
            width,
            height,
            strip: { x, y }
        } = this.animation
        ctx.drawImage(
            this.game.getImage(this.image),
            x + this.getAnimationFrame() * width,
            y,
            width,
            height,
            this.pos.x + this.shineX + camera.pos.x,
            this.pos.y + camera.pos.y - 10,
            width,
            height
        )
    }

    update() {
        if (this.onScreen()) {
            if (this.canAnimate && this.getAnimationFrame() === this.animation.strip.frames - 1) {
                this.canAnimate = false
                this.game.wait(
                    `spikes-${this.id}-shine`,
                    () => {
                        this.canAnimate = true
                        this.setAnimationFrame(0)
                        this.shineX = randomInt(0, (this.width - 8) / 8) * 8
                    },
                    1000
                )
            }
            this.animate(this.animation)
        }
    }

    collide(obj: Entity) {
        switch (obj.type) {
            case ENTITY_TYPES.PLAYER:
                const player = obj as Player
                player.hit(this.damage)
                break
        }
    }
}
