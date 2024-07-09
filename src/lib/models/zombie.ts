import { clamp, Emitter, Entity, randVector, Timer, vec2, Vector } from 'platfuse'
import { BloodParticle, Directions, ObjectTypes } from '../constants'
import Animations from '../animations/zombie'
import Player from './player'

const { Left, Right } = Directions

export default class Zombie extends Entity {
    image = 'zombie.png'
    animation = Animations.Rise
    facing = Left
    damping = 0.88
    renderOrder = 10
    health = 2
    isSpawned = false
    riseTimer = this.scene.game.timer()
    idleTimer = this.scene.game.timer()
    hurtTimer = this.scene.game.timer()
    attackTimer = this.scene.game.timer()
    spawnTimer = this.scene.game.timer()
    walkTimer = this.scene.game.timer()

    draw() {
        if (this.isSpawned) super.draw()
    }

    update() {
        if (this.hurtTimer.elapsed()) {
            this.hurtTimer.unset()
        }
        if (this.spawnTimer.elapsed()) {
            this.spawnTimer.unset()
            this.riseTimer.set(0.7)
            this.isSpawned = true
            this.setAnimationFrame(0)
        }
        if (!this.isSpawned && this.onScreen() && !this.spawnTimer.isActive()) {
            this.spawnTimer.set(3)
        }
        if (this.riseTimer.elapsed()) {
            this.idleTimer.set(2)
            this.riseTimer.unset()
        }
        if (this.idleTimer.elapsed()) {
            this.idleTimer.unset()
            this.walkTimer.set(5)
        }
        if (this.walkTimer.elapsed()) {
            this.walkTimer.unset()
            this.idleTimer.set(1)
            this.turn()
        }

        const player = this.scene.getObjectByType(ObjectTypes.Player) as Player

        if (this.walkTimer.isActive() && !this.hurtTimer.isActive() && !this.attackTimer.isActive()) {
            const speed =
                (this.facing === Left && this.pos.x > player.pos.x) ||
                (this.facing === Right && this.pos.x < player.pos.x)
                    ? 0.025
                    : 0.005
            this.force.x = clamp(this.force.x + (this.facing === Left ? -1 : 1) * speed, -this.maxSpeed, this.maxSpeed)
        }

        this.collideObjects = this.isSpawned && !this.riseTimer.isActive()

        super.update()

        let animation = Animations.Idle

        if (this.hurtTimer.isActive()) {
            animation = this.force.x > 0 && this.facing === Left ? Animations.Hurt2 : Animations.Hurt1
            if (this.health <= 0 && this.getAnimationFrame() === 5) this.destroy()
        } else if (this.riseTimer.isActive() || !this.isSpawned) animation = Animations.Rise
        else if (this.attackTimer.isActive()) animation = Animations.Attack
        else if (Math.abs(this.force.x) > 0.02) animation = Animations.Run
        else if (Math.abs(this.force.x) > 0.01) animation = Animations.Walk
        else if (this.force.x === 0) animation = Animations.Idle

        this.setAnimation(animation, this.facing === Left)
    }

    collideWithObject(entity: Entity): boolean {
        if (this.hurtTimer.isActive()) return false
        if (entity.type === ObjectTypes.Bullet) {
            this.health--
            this.hurtTimer.set(1.4)
            this.idleTimer.set(1)
            this.setAnimationFrame(0) // reset hurt animation
            this.walkTimer.unset()
            this.blood(entity.pos)
        }
        if (entity.type === ObjectTypes.Player) {
            this.attackTimer.set(1)
            this.facing = this.pos.x < entity.pos.x ? Directions.Right : Directions.Left
            this.blood(entity.pos.add(randVector(0.2)))
        }
        return true
    }

    collideWithTile(): boolean {
        this.turn()
        return true
    }

    blood(pos: Vector) {
        this.scene.addObject(new Emitter(this.scene, { ...BloodParticle, pos }))
    }

    turn() {
        this.facing = this.facing === Left ? Directions.Right : Directions.Left
    }

    // destroy() {
    //     this.dead = true
    //     // Reborn zombie at the same position on layer 3
    //     this.scene.addObject(new Zombie(this.scene, this.obj), 3)
    // }
}
