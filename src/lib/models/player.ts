import { Entity } from 'tiled-platformer-lib'
import { COLORS, IMAGES, DIRECTIONS, ENTITIES_FAMILY, INPUTS, PARTICLES, LAYERS, SOUNDS } from '../constants'
import { createParticles } from './particle'
import { createBullet } from './bullet'
import { createDust } from './dust'
import { approach } from '../helpers'
import ANIMATIONS from '../animations/player'

const { LEFT, RIGHT } = DIRECTIONS

export class Player extends Entity {
    public image = IMAGES.PLAYER
    public animations = ANIMATIONS
    public collisionLayers = [LAYERS.MAIN]
    public direction = RIGHT
    public activated = true
    public invincible = false
    public points = 0
    public energy = [100, 100] // current, max
    public ammo = [5, 5] // current, max
    public speed = { a: 10, d: 5, m: 80 } // a: acceleration, d: deceleration, m: maximum
    public jump = false
    public lives = 3

    constructor (obj: TPL.StringTMap<any>) {
        super(obj)
        this.addLightSource(COLORS.TRANS_WHITE, 90, 8)
        this.setBoundingBox(18, 16, this.width - 35, this.height - 16)
    }

    private canJump = () => this.onGround && !this.jump
    private canMove = (scene: TPL.Scene) => this.energy[0] > 0 && !scene.checkTimeout('player-shoot')
    private canShoot = (scene: TPL.Scene) => this.ammo[0] > 0 && !scene.checkTimeout('player-shoot') && this.onGround
    private canHurt = (scene: TPL.Scene) => !scene.checkTimeout('player-hurt')

    private cameraFollow (scene: TPL.Scene): void {
        const { camera, viewport: { resolutionX, resolutionY } } = scene
        this.direction === LEFT
            ? camera.setFocusPoint(resolutionX - resolutionX / 3, resolutionY / 2)
            : camera.setFocusPoint(resolutionX / 3, resolutionY / 2)
    }

    private dust (scene: TPL.Scene, direction: string): void {
        scene.addObject(
            createDust(direction === RIGHT ? this.x : this.x + this.width - 16, this.y + this.height - 16, direction)
        )
    }

    private bullet (scene: TPL.Scene, direction: string): void {
        scene.addObject(
            createBullet(direction === RIGHT ? this.x + this.width - 8 : this.x + 8, this.y + 31, direction)
        )
    }

    private shoot (scene: TPL.Scene): void {
        this.force.x = 0
        this.ammo[0] -= 1
        this.sprite.animFrame = 0
        this.bullet(scene, this.direction)
        scene.stopTimeout('player-reload')
        scene.startTimeout('player-shoot', 500)
        scene.startTimeout('player-shoot-delay', 60, () => scene.startTimeout('player-shoot-flash', 100))
        SOUNDS.SHOOT.play()
    }

    private reload (scene: TPL.Scene): void {
        this.force.x === 0 && this.onGround && this.ammo[0] < this.ammo[1]
            ? scene.startTimeout('player-reload', 1000, () => {
                this.ammo[0] += 1
                SOUNDS.RELOAD.play()
            })
            : scene.stopTimeout('player-reload')
    }

    public collide (obj: TPL.Entity, scene: TPL.Scene) {
        if (this.canHurt(scene) && obj.damage > 0 && (
            obj.family === ENTITIES_FAMILY.ENEMIES ||
            obj.family === ENTITIES_FAMILY.TRAPS
        )) {
            if (this.invincible) return
            scene.startTimeout('player-hurt', 500)
            scene.stopTimeout('player-reload')
            if (this.canMove(scene)) {
                createParticles (scene, PARTICLES.BLOOD, this.x + this.width / 2, this.y + 18) 
                this.hit(obj.damage)
            }
        }
    }

    public hit (damage: number) {
        if (this.energy[0] > 0) {
            this.energy[0] -= damage
        }
    }

    public input (scene: TPL.Scene, delta: number): void {
        const { input: { states } } = scene
        const { a, d, m } = this.speed
        
        const gravity = scene.getProperty('gravity') * delta

        if (!this.onGround) this.force.y += (this.force.y > 0 ? gravity : gravity / 2) 
        else if (Math.abs(this.force.y) <= 0.2) this.force.y = 0
        
        if (this.canMove(scene)) {
            if ((states[INPUTS.LEFT] || states[INPUTS.RIGHT])) {
                const newDirection = states[INPUTS.LEFT] ? LEFT : RIGHT
                if (newDirection !== this.direction && this.onGround) this.dust(scene, newDirection)
                this.force.x = approach(this.force.x, states[INPUTS.LEFT] ? -m : m, a, delta) 
                this.direction = newDirection
                this.cameraFollow(scene)
            }
            else this.force.x = approach(this.force.x, 0, d, delta)

            if (states[INPUTS.ACTION] && this.canShoot(scene)) {
                this.shoot(scene)
            }
        
            if (states[INPUTS.UP] && this.canJump()) {
                this.jump = true
                this.force.y = -4
            }
            else if (this.jump && this.onGround) {
                this.jump = false 
                this.dust(scene, LEFT)
                this.dust(scene, RIGHT)
            }
        }
    }

    public update (scene: TPL.Scene, delta: number): void {
        this.input(scene, delta)
        this.reload(scene)
        super.update(scene)
    
        const { IDLE, WALK, JUMP, FALL, HURT, RELOAD, SHOOT } = this.animations
      
        let animation: TPL.Animation

        if (scene.checkTimeout('player-hurt')) animation = HURT 
        else if (this.jump) animation = this.force.y <= 0 ? JUMP : FALL
        else if (scene.checkTimeout('player-shoot')) animation = SHOOT 
        else if (Math.abs(this.force.x) > 0) animation = WALK 
        else if (scene.checkTimeout('player-reload')) animation = RELOAD
        else animation = IDLE

        animation.strip.y = this.invincible ? 53 : 0
        
        this.sprite.flipH = this.direction === LEFT
        this.sprite.animate(animation)
    }
}
