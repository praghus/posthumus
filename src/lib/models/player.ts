import { clamp, randVector, vec2, Vector, wait } from 'platfuse'
import { Directions, ObjectTypes, OneWayTiles, Items } from '../constants'
import Animations from '../animations/player'
import GameObject from './game-object'
import Bullet from './bullet'
import Dust from './dust'
import MainScene from '../scenes/main-scene'

const { Left, Right } = Directions

export default class Player extends GameObject {
    type = ObjectTypes.Player
    image = 'player.png'
    animation = Animations.Idle
    facing = Right
    health = [10, 10]
    ammo = [4, 4]
    renderOrder = 10
    damping = 0.92
    friction = 0.9
    moveInput = vec2()
    startPos = this.pos.clone()
    // flags
    holdingJump = false
    wasHoldingJump = false
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

    handleInput() {
        const { game } = this.scene
        const { input } = game

        this.holdingJump = !!(input.keyIsDown('ArrowUp') || input.keyIsDown('KeyW'))
        this.isShooting = !!input.keyIsDown('Space')
        this.moveInput = vec2(
            (input.keyIsDown('ArrowRight') || input.keyIsDown('KeyD')) -
                (input.keyIsDown('ArrowLeft') || input.keyIsDown('KeyA')),
            (input.keyIsDown('ArrowUp') || input.keyIsDown('KeyW')) -
                (input.keyIsDown('ArrowDown') | input.keyIsDown('KeyS'))
        )

        this.facing = this.moveInput.x === 1 ? Right : this.moveInput.x === -1 ? Left : this.facing

        if (input.mouseWasPressed(0) && this.moveInput.y === 0) {
            const pointer = this.scene.getPointerRelativeGridPos()
            if (
                this.moveInput.x === 0 ||
                (this.facing === Right && pointer.x > this.pos.x) ||
                (this.facing === Left && pointer.x < this.pos.x)
            ) {
                this.isShooting = true
                this.facing = pointer.x > this.pos.x ? Right : Left
            }
        }
    }

    update() {
        if (!this.onScreen()) return super.update()

        this.handleInput()
        const moveInput = this.deadTimer.isActive() ? vec2(0) : this.moveInput.clone()

        if (this.hurtTimer.isDone()) this.hurtTimer.unset()

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
                    pos: this.pos.add(vec2(this.facing === Left ? -1.2 : 1.2, -0.15)),
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
        if (this.reloadTimer.isDone()) {
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
            if (this.holdingJump && this.force.y < 0 && this.jumpTimer.isActive()) this.force.y -= 0.06
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
                this.force.y -= this.scene.gravity * 0.2
            }
        }
        // Ground control -----------------------------------------------------
        if (
            this.onGround &&
            Math.sign(this.moveInput.x) !== Math.sign(this.force.x) &&
            Math.abs(this.force.x) > 0.123
        ) {
            this.dust()
        }
        this.force.x = clamp(this.force.x + moveInput.x * 0.028, -this.maxSpeed, this.maxSpeed)
        this.lastPos = this.pos.clone()

        super.update()

        let animation = Animations.Idle
        if (this.deadTimer.isActive()) animation = Animations.Defeat
        else if (this.hurtTimer.isActive()) animation = Animations.Hurt
        else if (this.jumpTimer.isActive() && !this.onGround)
            animation = this.force.y <= 0 ? Animations.Jump : Animations.Fall
        else if (this.shootTimer.isActive()) animation = Animations.Shoot
        else if (this.isReloading) animation = Animations.Reload
        else if (moveInput.x && Math.abs(this.force.x) !== 0 && this.onGround) animation = Animations.Walk
        this.setAnimation(animation, this.facing === Left)
    }

    collideWithTile(tileId: number, pos: Vector): boolean {
        if (OneWayTiles.includes(tileId)) {
            return this.force.y > 0 && this.pos.y < pos.y && this.moveInput.y !== -1
        }
        return true
    }

    collideWithObject(entity: GameObject): boolean {
        if (this.deadTimer.isActive() || entity.type === ObjectTypes.Bullet) return false
        if (entity.type === ObjectTypes.Item) {
            this.scene.game.playSound('powerup.mp3')
            switch (entity.gid) {
                case Items.Ammo:
                    this.ammo[1] += 1
                    break
                case Items.Health:
                    this.health[0] = this.health[1]
                    break
            }
            entity.destroy()
        }
        if (entity.family === 'enemy' && !this.hurtTimer.isActive()) {
            // this.applyForce(entity.force.scale(-1))
            this.health[0] -= entity.damage || 1
            if (this.health[0] > 0) {
                this.hurtTimer.set(0.5)
                this.scene.camera.shake(0.5, vec2(0.001))
            } else {
                this.deadTimer.set(2)
                this.hurtTimer.unset()
                wait(500, () => (this.scene as MainScene).fadeOut())
                wait(2000, () => this.scene.game.restartScene())
            }
            this.setAnimationFrame(0) // reset hurt animation
            this.blood(this.pos.add(randVector(0.2)))
        }
        return true
    }

    dust(side: (typeof Directions)[keyof typeof Directions] = this.facing) {
        const pos = side === Left ? vec2(-1.2, 0.3) : vec2(0.85, 0.3)
        const dust = new Dust(this.scene, { pos: this.pos.add(pos), flipH: side === Right })
        this.scene.addObject(dust, 3)
    }
}
