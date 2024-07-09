import { clamp, Entity, Scene, Timer, vec2, Vector } from 'platfuse'
import Animations from '../animations/player'
import { Directions, ObjectTypes } from '../constants'
import Bullet from './bullet'
const { Left, Right } = Directions

export default class Player extends Entity {
    image = 'player.png'
    animation = Animations.Idle
    facing = Right
    health = [100, 100]
    ammo = [5, 5]
    renderOrder = 10
    damping = 0.88
    friction = 0.9
    maxSpeed = 0.5
    moveInput = vec2()
    startPos = this.pos.clone()
    // flags
    holdingJump = false
    wasHoldingJump = false
    invincible = false
    isDying = false
    isHurt = false
    isShooting = false
    isReloading = false
    // timers
    deadTimer = this.scene.game.timer()
    groundTimer = this.scene.game.timer()
    idleTimer = this.scene.game.timer()
    hurtTimer = this.scene.game.timer()
    jumpPressedTimer = this.scene.game.timer()
    jumpTimer = this.scene.game.timer()
    shootTimer = this.scene.game.timer()
    reloadTimer = this.scene.game.timer()

    constructor(scene: Scene, obj: Record<string, any>) {
        super(scene, obj)
        scene.camera.setSpeed(0.015)
        scene.camera.follow(this)
        setTimeout(() => {
            scene.camera.setSpeed(0.06)
        }, 5000)
    }

    handleInput() {
        const { game } = this.scene
        const { input } = game

        this.holdingJump = !!input.keyIsDown('ArrowUp')
        this.isShooting = !!input.keyIsDown('Space')
        this.moveInput = vec2(
            input.keyIsDown('ArrowRight') - input.keyIsDown('ArrowLeft'),
            input.keyIsDown('ArrowUp') - input.keyIsDown('ArrowDown')
        )

        this.facing = this.moveInput.x === 1 ? Right : this.moveInput.x === -1 ? Left : this.facing
    }

    update() {
        // if (this.deadTimer.elapsed()) {
        //     this.deadTimer.unset()
        //     this.pos = this.startPos.clone()
        //     this.isDying = false
        // }
        if (this.hurtTimer.elapsed()) {
            this.hurtTimer.unset()
            this.isHurt = false
        }
        if (this.isDying) return super.update()

        this.handleInput()

        const moveInput = this.moveInput.clone()
        const { gravity } = this.scene

        // Ground detection ---------------------------------------------------
        if (this.onGround) {
            this.groundTimer.set(0.1)
        }
        // Shoot -------------------------------------------------------------
        if (this.isShooting && this.groundTimer.isActive() && this.ammo[0] > 0 && !this.shootTimer.isActive()) {
            this.setAnimationFrame(0)
            this.shootTimer.set(0.5)
            this.scene.game.playSound('shoot.mp3')
            this.scene.addObject(
                new Bullet(this.scene, {
                    pos: this.pos.add(vec2(this.facing === Left ? -1.2 : 1.2, 0.15)),
                    force: vec2(this.facing === Left ? -0.6 : 0.6, 0)
                })
            )
            this.ammo[0]--
            this.scene.game.setSetting('flash', true)
            // this.scene.camera.shake(300, vec2(0.001))
            this.reloadTimer.set(2)
        }
        if (this.shootTimer.isActive()) {
            moveInput.x = 0
            if (this.shootTimer.getPercent() > 0.1) {
                this.scene.game.setSetting('flash', false)
            }
        }
        // Reload ------------------------------------------------------------
        if (this.reloadTimer.isActive() && this.reloadTimer.getPercent() > 0.6) {
            this.isReloading = this.ammo[0] < this.ammo[1]
        }
        if (this.reloadTimer.elapsed()) {
            if (this.ammo[0] < this.ammo[1]) {
                this.ammo[0] += 1
                this.reloadTimer.set(1)
                this.scene.game.playSound('reload.mp3')
                if (this.ammo[0] === this.ammo[1]) this.isReloading = false
            } else {
                this.isReloading = false
                this.reloadTimer.unset()
            }
        }
        if (this.moveInput.x !== 0 || this.moveInput.y !== 0) {
            this.reloadTimer.set(1)
            this.isReloading = false
        }
        // Jump --------------------------------------------------------------
        if (!this.holdingJump) {
            this.jumpPressedTimer.unset()
        } else if (!this.wasHoldingJump) {
            this.jumpPressedTimer.set(0.3)
        }
        if (this.groundTimer.isActive()) {
            if (this.jumpPressedTimer.isActive() && !this.jumpTimer.isActive()) {
                this.force.y = -0.15
                this.jumpTimer.set(0.5)
            }
        }
        if (this.jumpTimer.isActive()) {
            this.groundTimer.unset()
            if (this.holdingJump && this.force.y < 0 && this.jumpTimer.isActive()) this.force.y -= 0.07
        }
        this.wasHoldingJump = this.holdingJump
        // Air control -------------------------------------------------------
        if (!this.onGround) {
            // moving in same direction
            if (Math.sign(moveInput.x) === Math.sign(this.force.x)) moveInput.x *= 0.4
            // moving against force
            else moveInput.x *= 0.8
            // add gravity when falling down
            if (this.force.y > 0) {
                this.force.y -= gravity * 0.2
            }
        }
        // Ground control -----------------------------------------------------
        this.force.x = clamp(this.force.x + moveInput.x * 0.018, -this.maxSpeed, this.maxSpeed)
        this.lastPos = this.pos.clone()

        super.update()

        let animation = Animations.Idle
        if (this.isHurt) animation = Animations.Hurt
        else if (this.jumpTimer.isActive() && !this.onGround)
            animation = this.force.y <= 0 ? Animations.Jump : Animations.Fall
        else if (this.shootTimer.isActive()) animation = Animations.Shoot
        else if (this.isReloading) animation = Animations.Reload
        else if (moveInput.x && Math.abs(this.force.x) > 0.01 && this.onGround) animation = Animations.Walk
        this.setAnimation(animation, this.facing === Left)
    }

    collideWithTile(tileId: number, pos: Vector): boolean {
        // One way platforms
        if (tileId === 74) {
            return this.force.y > 0 && this.pos.y < pos.y && this.moveInput.y !== -1
        }
        return true
    }

    collideWithObject(entity: Entity): boolean {
        if (entity.type === ObjectTypes.Bullet) {
            return false
        }
        if (entity.type === ObjectTypes.Zombie) {
            this.applyForce(entity.force.scale(-1))
        }
        return true
    }
}
