import { Color, Emitter, Entity } from 'platfuse'
import { BoxParticle, ObjectTypes } from '../constants'

export default class Box extends Entity {
    health = 3
    damping = 0.8
    hitColor = new Color(255, 255, 255, 0.5)
    hitTimer = this.scene.game.timer()

    draw() {
        super.draw()
        if (this.hitTimer.isActive()) {
            this.scene.game.draw.fillRect(this.getRelativeBoundingRect(), this.hitColor)
        }
    }

    collideWithObject(entity: Entity): boolean {
        if (entity.type === ObjectTypes.Bullet) {
            this.hitTimer.set(0.05)
            if (this.health-- <= 0) {
                this.destroy()
            }
            this.scene.addObject(new Emitter(this.scene, { ...BoxParticle, pos: this.pos }))
        }
        return true
    }
}
