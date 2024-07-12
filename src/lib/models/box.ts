import { Color, Emitter, Entity } from 'platfuse'
import { BoxParticle, ObjectTypes } from '../constants'

export default class Box extends Entity {
    type = ObjectTypes.Box
    hitColor = new Color(255, 255, 255, 0.5)
    hitTimer = this.scene.game.timer()
    damping = 0.8
    health = 3

    draw() {
        super.draw()
        if (this.hitTimer.isActive()) {
            this.scene.game.draw.fillRect(this.getRelativeBoundingRect(), this.hitColor)
        }
    }

    collideWithObject(entity: Entity): boolean {
        if (entity.type === ObjectTypes.Bullet) {
            this.hitTimer.set(0.05)
            if (--this.health <= 0) this.destroy()
            this.scene.addObject(new Emitter(this.scene, { ...BoxParticle, pos: this.pos }))
        }
        return true
    }
}
