import { Color, Emitter, Entity } from 'platfuse'
import { BoxParticle, ObjectTypes } from '../constants'
import GameObject from './game-object'

export default class Box extends GameObject {
    type = ObjectTypes.Box
    hitColor = new Color(255, 255, 255, 0.5)
    hitTimer = this.scene.game.timer()
    damping = 0.8
    health = 3

    draw() {
        super.draw()
        if (this.hitTimer.isActive()) {
            const { draw } = this.scene.game
            draw.setBlending(true)
            draw.fillRect(this.getRelativeBoundingRect(), this.hitColor)
            draw.setBlending(false)
        }
    }

    collideWithObject(entity: Entity): boolean {
        if (entity.type === ObjectTypes.Bullet) {
            this.hitTimer.set(0.05)
            if (--this.health <= 0) this.dead = true
            this.scene.addObject(new Emitter(this.scene, { ...BoxParticle, pos: this.pos }))
        }
        return true
    }
}
