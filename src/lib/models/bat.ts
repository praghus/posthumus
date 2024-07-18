import { Entity, lerp, randVector } from 'platfuse'
import Animations from '../animations/bat'
import { ObjectTypes } from '../constants'
import GameObject from './game-object'
import Player from './player'

export default class Bat extends GameObject {
    type = ObjectTypes.Bat
    family = 'enemy'
    image = 'bat.png'
    animation = Animations.Idle
    health = 2
    damage = 1
    idle = true
    mass = 0.1
    damping = 0.88
    gravityScale = 0
    hurtTimer = this.scene.game.timer()
    isKilled = false

    update(): void {
        const player = this.scene.getObjectByType(ObjectTypes.Player) as Player
        if (!this.idle) {
            if (this.hurtTimer.isDone()) this.hurtTimer.unset()
            if (!this.hurtTimer.isActive()) {
                this.force.x = lerp(this.force.x, player.pos.x - this.pos.x, 0.002) / 200
                this.force.y = lerp(this.force.y, player.pos.y - this.pos.y, 0.001) / 200
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
            if (this.health <= 0) this.destroy()
        }
        return true
    }
}
