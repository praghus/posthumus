import { Entity, Scene, Vec2 } from 'platfuse'
import { createParticles, PARTICLES } from './particle'
import { DIRECTIONS, ENTITY_TYPES, LAYERS } from '../constants'
import ANIMATIONS from '../animations/player'
import MainScene from '../scenes/main'
import Overlay from '../layers/overlay'

const { UP, LEFT, RIGHT } = DIRECTIONS

export default class Player extends Entity {
    image = 'player.png'
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    facing = RIGHT
    energy = [100, 100]
    ammo = [5, 5]
    points = 0
    collisions = true
    invincible = false
    isJumping = false
    isShooting = false
    isReloading = false
    isHurt = false

    update() {
        const game = this.game
        const { gravity } = game.getCurrentScene() as MainScene
        if (this.isJumping && this.onGround()) {
            this.isJumping = false
            this.dust(LEFT)
            this.dust(RIGHT)
        }
        if (!this.onGround()) this.force.y += this.force.y > 0 ? gravity : gravity / 2
        if (this.energy[0] > 0 && !this.isShooting) {
            if (this.force.x !== 0) this.force.x = this.approach(this.force.x, 0, 0.2)
            this.force.x === 0 && !this.isJumping && this.ammo[0] < this.ammo[1]
                ? game.wait('countToReload', () => this.countToReload(), 1000)
                : this.cancelReloading()
        }

        super.update()

        let animation = ANIMATIONS.IDLE
        if (this.isHurt) animation = ANIMATIONS.HURT
        else if (this.isJumping) animation = this.force.y <= 0 ? ANIMATIONS.JUMP : ANIMATIONS.FALL
        else if (this.isShooting) animation = ANIMATIONS.SHOOT
        else if (Math.abs(this.force.x) > 0) animation = ANIMATIONS.WALK
        else if (this.isReloading) animation = ANIMATIONS.RELOAD
        this.animate(animation, { H: this.facing === LEFT })
    }

    moveTo(direction: DIRECTIONS) {
        if (!this.isShooting && this.energy[0] > 0) {
            switch (direction) {
                case UP:
                    if (!this.isJumping && this.onGround()) {
                        this.isJumping = true
                        this.force.y = -6
                    }
                    break
                case LEFT:
                case RIGHT:
                    direction !== this.facing && this.onGround() && this.dust(direction)
                    this.force.x = this.approach(this.force.x, direction === RIGHT ? 2 : -2, 0.3)
                    this.facing = direction
                    // this.cameraFollow()
                    break
            }
        }
    }

    shoot() {
        if (!this.isShooting && !this.isHurt && this.ammo[0] > 0 && this.onGround()) {
            const scene = this.game.getCurrentScene() as MainScene
            if (this.ammo[0] > this.ammo[1]) this.ammo[0] = this.ammo[1]
            this.ammo[0] -= 1
            this.force.x = 0
            this.isShooting = true
            this.bullet(scene)
            this.cancelReloading()
            this.game.wait('shoot', () => (this.isShooting = false), 500)
            this.game.wait(
                'shootDelay',
                () => {
                    scene.flash = true
                    this.game.wait('shootFlash', () => (scene.flash = false), 60)
                },
                30
            )
            this.setAnimationFrame(0)
            this.game.playSound('shoot.mp3')
        }
    }

    reloading() {
        this.isReloading = true
        this.ammo[0] += 1
        this.game.playSound('reload.mp3')
    }

    countToReload() {
        this.isReloading = true
        this.game.wait('reloading', () => this.reloading(), 600)
    }

    cancelReloading() {
        this.game.cancelWait('countToReload')
        this.game.cancelWait('reloading')
        this.isReloading = false
    }

    bullet(scene: Scene) {
        const x = this.facing === RIGHT ? this.pos.x + this.width - 4 : this.pos.x + 8
        const y = this.pos.y + 31
        scene.addObject(ENTITY_TYPES.BULLET, { x, y, direction: this.facing })
    }

    dust(direction: string) {
        if (this.onGround()) {
            const scene = this.game.getCurrentScene()
            const x = direction === RIGHT ? this.pos.x + 8 : this.pos.x + this.width - 24
            const y = this.pos.y + this.height - 16
            scene.addObject(ENTITY_TYPES.DUST, { x, y, direction })
        }
    }

    // cameraFollow() {
    //     const scene = this.game.getCurrentScene()
    //     const { x } = this.game.resolution
    //     scene.camera.setOffset(this.facing === RIGHT ? x / 3 : -x / 3, 0)
    // }

    respawn() {
        const scene = this.game.getCurrentScene() as MainScene
        const overlay = scene.getLayer(LAYERS.CUSTOM_OVERLAY) as Overlay
        this.isHurt = false
        this.visible = true
        this.energy[0] = this.energy[1]
        this.pos = this.initialPos.clone()
        scene.camera.moveTo(0, 0)
        overlay.fadeIn()
    }

    hit(damage: number) {
        const scene = this.game.getCurrentScene() as MainScene
        const overlay = scene.getLayer(LAYERS.CUSTOM_OVERLAY) as Overlay
        if (this.energy[0] > 0 && !this.isHurt) {
            if (!this.invincible) {
                this.energy[0] -= damage
                this.isHurt = true
                this.force.x = 0
                this.game.cancelWait('countToReload')
                if (this.energy[0] <= 0) {
                    this.visible = false
                    overlay.fadeOut()
                    this.game.wait('playerRespawn', () => this.respawn(), 3000)
                } else {
                    this.game.wait('playerHurt', () => (this.isHurt = false), 500)
                }
                createParticles(this.game, new Vec2(this.pos.x + this.width / 2, this.pos.y + 18), PARTICLES.BLOOD)
            }
        }
    }
}
