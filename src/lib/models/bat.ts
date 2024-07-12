import { Emitter, Entity, lerp, randVector, Vector } from 'platfuse'
import Animations from '../animations/bat'
import { BloodParticle, ObjectTypes } from '../constants'
import Player from './player'

export default class Bat extends Entity {
    type = ObjectTypes.Bat
    image = 'bat.png'
    animation = Animations.Idle
    mass = 0.1
    health = 2
    idle = true
    damping = 0.88
    damage = 1
    gravityScale = 0
    hurtTimer = this.scene.game.timer()
    isKilled = false

    update(): void {
        const player = this.scene.getObjectByType(ObjectTypes.Player) as Player
        if (this.isKilled) {
            // this.angle += 0.1
            this.gravityScale = 0.3
            this.collideObjects = false
            // this.collideTiles = false
            this.setAnimation(Animations.Fall)
        } else if (!this.idle) {
            if (this.hurtTimer.isDone()) this.hurtTimer.unset()
            if (!this.hurtTimer.isActive()) {
                this.force.x = lerp(this.force.x, player.pos.x - this.pos.x, 0.002) / 200
                this.force.y = lerp(this.force.y, player.pos.y - this.pos.y + 0.5, 0.001) / 200
            }
            // this.pos = this.pos.lerp(player.pos, 0.002)
            this.setAnimation(Animations.Fly, this.pos.x > player.pos.x)
        } else if (this.onScreen() && this.pos.x < player.pos.x) this.idle = false

        super.update()
    }

    collideWithObject(entity: Entity): boolean {
        if (this.hurtTimer.isActive() || this.idle) return false
        if (entity.type === ObjectTypes.Bullet) {
            this.health--
            this.hurtTimer.set(0.4)
            this.blood(entity.pos.add(randVector(0.2)))
            if (this.health <= 0) this.isKilled = true
        }
        if (entity.type === ObjectTypes.Player) {
            this.blood(entity.pos.add(randVector(0.2)))
        }
        return true
    }

    blood(pos: Vector) {
        this.scene.addObject(new Emitter(this.scene, { ...BloodParticle, pos }))
    }
}
