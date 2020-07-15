import { Entity } from 'tiled-platformer-lib'
import { COLORS, IMAGES, DIRECTIONS, ENTITIES_FAMILY, INPUTS, LAYERS, SOUNDS } from '../constants'
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
    public points = 0
    public energy = [100, 100] // current, max
    public ammo = [5, 5] // current, max
    public speed = { a: 0.1, d: 0.1, m: 2 } // a: acceleration, d: deceleration, m: maximum
    public jump = false
    public lives = 3

    private countToReload = 0

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
            ? camera.setMiddlePoint(resolutionX - resolutionX / 3, resolutionY / 2)
            : camera.setMiddlePoint(resolutionX / 3, resolutionY / 2)
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

    public collide (obj: TPL.Entity, scene: TPL.Scene) {
        if (this.canHurt(scene) && obj.damage > 0 && (
            obj.family === ENTITIES_FAMILY.ENEMIES ||
            obj.family === ENTITIES_FAMILY.TRAPS
        )) {
            // if (!!debug) return
            scene.startTimeout('player-hurt', 500)
            this.hit(obj.damage)
        }
    }

    public hit (damage: number) {
        if (this.energy[0] > 0) {
            this.energy[0] -= damage
            this.countToReload = 0
        }
        else {
            // game over
            this.energy[0] = 100
        }
    }

    public input (scene: TPL.Scene): void {
        const { input: { states }, properties: { gravity } } = scene
        const { a, d, m } = this.speed

        if (!this.onGround) this.force.y += this.force.y > 0 ? gravity : gravity / 2
        else if (Math.abs(this.force.y) <= 0.2) this.force.y = 0
        
        if (this.canMove(scene)) {
            if ((states[INPUTS.LEFT] || states[INPUTS.RIGHT])) {
                const newDirection = states[INPUTS.LEFT] ? LEFT : RIGHT
                if (newDirection !== this.direction && this.onGround) this.dust(scene, newDirection)
                this.force.x = approach(this.force.x, states[INPUTS.LEFT] ? -m : m, a)
                this.direction = newDirection
                this.cameraFollow(scene)
            }
            else this.force.x = approach(this.force.x, 0, d)

            if (states[INPUTS.ACTION] && this.canShoot(scene)) {
                this.shoot(scene)
            }
        
            if (states[INPUTS.UP] && this.canJump()) {
                this.jump = true
                this.force.y = -6.8
            }
            else if (this.jump && this.onGround) {
                this.jump = false 
                this.dust(scene, LEFT)
                this.dust(scene, RIGHT)
            }
        }
    }

    public update (scene: TPL.Scene): void {
        this.input(scene)
        this.reload()
        super.update(scene)
    
        const { IDLE, WALK, JUMP, FALL, HURT, RELOAD, SHOOT } = this.animations
      
        let animation: TPL.Animation

        if (scene.checkTimeout('player-hurt')) animation = HURT 
        else if (this.jump) animation = this.force.y <= 0 ? JUMP : FALL
        else if (scene.checkTimeout('player-shoot')) animation = SHOOT 
        else if (Math.abs(this.force.x) > 0) animation = WALK 
        // @todo: reloading based on timeouts
        else if (this.countToReload >= 40 && this.ammo[0] < this.ammo[1]) animation = RELOAD
        else animation = IDLE

        this.sprite.flipH = this.direction === LEFT
        this.sprite.animate(animation)
    }

    private shoot (scene: TPL.Scene) {
        this.force.x = 0
        this.ammo[0] -= 1
        this.sprite.animFrame = 0
        this.countToReload = 0
        this.bullet(scene, this.direction)
        scene.startTimeout('player-shoot', 500)
        scene.startTimeout('player-shoot-delay', 60, () => scene.startTimeout('player-shoot-flash', 100))
        SOUNDS.SHOOT.play()
    }

    private reload () {
        this.force.x === 0 && this.onGround
            ? this.countToReload++
            : this.countToReload = 0

        if (this.countToReload === 100 && this.ammo[0] < this.ammo[1]) {
            this.ammo[0] += 1
            this.countToReload = 40
            SOUNDS.RELOAD.play()
        }
    }
}
