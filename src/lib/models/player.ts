import { Game, Entity, Scene, Vec2 } from 'platfuse'
import { createParticles, PARTICLES } from './particle'
import { DIRECTIONS, LAYERS } from '../constants'
import ANIMATIONS from '../animations/player'
import MainScene from '../scenes/main'
import Dust from './dust'
import Bullet from './bullet'
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

    update(game: Game) {
        super.update(game)
        if (this.isJumping && this.onGround()) {
            this.isJumping = false
            this.dust(game, LEFT)
            this.dust(game, RIGHT)
        }
        if (!this.onGround()) this.force.y += this.force.y > 0 ? 0.5 : 0.5 / 2

        if (this.energy[0] > 0 && !this.isShooting) {
            if (this.force.x !== 0) this.force.x = this.approach(this.force.x, 0, 0.2)
            this.force.x === 0 && !this.isJumping && this.ammo[0] < this.ammo[1]
                ? game.wait('countToReload', this.countToReload, 1000)
                : this.cancelReloading(game)
        }

        let animation = ANIMATIONS.IDLE
        if (this.isHurt) animation = ANIMATIONS.HURT
        else if (this.isJumping) animation = this.force.y <= 0 ? ANIMATIONS.JUMP : ANIMATIONS.FALL
        else if (this.isShooting) animation = ANIMATIONS.SHOOT
        else if (Math.abs(this.force.x) > 0) animation = ANIMATIONS.WALK
        else if (this.isReloading) animation = ANIMATIONS.RELOAD
        this.animate(animation, { H: this.facing === LEFT })
    }
    move(game: Game, direction: DIRECTIONS) {
        if (!this.isShooting) {
            switch (direction) {
                case UP:
                    if (!this.isJumping && this.onGround()) {
                        this.isJumping = true
                        this.force.y = -6
                    }
                    break
                case LEFT:
                case RIGHT:
                    direction !== this.facing && this.onGround && this.dust(game, direction)
                    this.force.x = this.approach(this.force.x, direction === RIGHT ? 2 : -2, 0.3)
                    this.facing = direction
                    this.cameraFollow(game)
                    break
            }
        }
    }
    shoot(game: Game): void {
        if (!this.isShooting && !this.isHurt && this.ammo[0] > 0 && this.onGround()) {
            const scene = game.getCurrentScene() as MainScene
            this.ammo[0] -= 1
            this.force.x = 0
            this.isShooting = true
            this.bullet(scene)
            this.cancelReloading(game)
            game.wait('shoot', () => (this.isShooting = false), 500)
            game.wait(
                'shootDelay',
                () => {
                    scene.flash = true
                    game.wait('shootFlash', () => (scene.flash = false), 60)
                },
                30
            )
            this.setAnimationFrame(0)
            game.playSound('shoot.mp3')
        }
    }
    reloading = (game: Game) => {
        this.isReloading = true
        this.ammo[0] += 1
        game.playSound('reload.mp3')
    }
    countToReload = (game: Game) => {
        this.isReloading = true
        game.wait('reloading', this.reloading, 600)
    }
    cancelReloading(game: Game) {
        game.cancelWait('countToReload')
        game.cancelWait('reloading')
        this.isReloading = false
    }
    bullet(scene: Scene): void {
        const x = this.facing === RIGHT ? this.pos.x + this.width - 4 : this.pos.x + 8
        const y = this.pos.y + 31
        scene.addObject(new Bullet({ x, y, direction: this.facing }))
    }
    dust(game: Game, direction: string): void {
        if (this.onGround()) {
            const scene = game.getCurrentScene()
            const x = direction === RIGHT ? this.pos.x + 8 : this.pos.x + this.width - 24
            const y = this.pos.y + this.height - 16
            scene.addObject(new Dust({ x, y, direction }))
        }
    }
    cameraFollow(game: Game): void {
        const scene = game.getCurrentScene()
        this.facing === LEFT
            ? scene.camera.setFocusPoint(game.resolution.x - game.resolution.x / 3, game.resolution.y / 2)
            : scene.camera.setFocusPoint(game.resolution.x / 3, game.resolution.y / 2)
    }
    respawn = (game: Game) => {
        const scene = game.getCurrentScene() as MainScene
        const overlay = scene.getLayer(LAYERS.CUSTOM_OVERLAY) as Overlay
        this.isHurt = false
        this.visible = true
        this.energy[0] = this.energy[1]
        overlay.fadeIn()
    }
    hit(damage: number, game: Game) {
        const scene = game.getCurrentScene() as MainScene
        const overlay = scene.getLayer(LAYERS.CUSTOM_OVERLAY) as Overlay
        if (this.energy[0] > 0 && !this.isHurt) {
            if (!this.invincible) {
                this.energy[0] -= damage
            }
            this.isHurt = true
            game.cancelWait('countToReload')
            if (this.energy[0] <= 0) {
                this.force.x = 0
                this.visible = false
                overlay.fadeOut()
                game.wait('playerRespawn', this.respawn, 3000)
            } else {
                game.wait('playerHurt', () => (this.isHurt = false), 500)
            }
            createParticles(scene, new Vec2(this.pos.x + this.width / 2, this.pos.y + 18), PARTICLES.BLOOD)
        }
    }
}
