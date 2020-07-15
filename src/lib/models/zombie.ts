import { Entity } from 'tiled-platformer-lib'
import { approach } from '../helpers'
import { IMAGES, DIRECTIONS, ENTITIES_TYPE, LAYERS, ENTITIES_FAMILY } from '../constants'
import ANIMATIONS from '../animations/zombie'


const { LEFT, RIGHT } = DIRECTIONS

export class Zombie extends Entity {
    public image = IMAGES.ZOMBIE
    public family = ENTITIES_FAMILY.ENEMIES
    public animations = ANIMATIONS
    public collisionLayers = [LAYERS.MAIN]
    public direction = RIGHT
    public damage = 0
    public energy = [20, 20]
    public speed = { a: 0.05, d: 0.02, m: 0.3 }
    
    private states = { RISE: 0, IDLE: 1, WALK: 2, RUN: 3, ATTACK: 4, HURT: 5, DEFEAT: 6 }
    private state: number

    private facingPlayer = (player: TPL.Entity) => (
        this.direction === LEFT && this.x > player.x ||
        this.direction === RIGHT && this.x < player.x
    )

    private turnAround = (): void => {
        this.direction = this.direction === RIGHT ? LEFT : RIGHT
        this.force.x *= -0.6
    }

    constructor (obj: TPL.StringTMap<any>) {
        super(obj)
        this.state = this.states.RISE
        this.setBoundingBox(24, 12, this.width - 48, this.height - 16)
    }

    public hit (damage: number): void {
        if (this.activated && this.state !== this.states.HURT) {
            super.hit(damage)
        }
        this.sprite.animFrame = 0
        this.state = this.states.HURT
    }

    public collide (obj: TPL.Entity) {
        if (this.activated  && obj.type === ENTITIES_TYPE.PLAYER) {
            this.state = this.states.ATTACK
            this.damage = this.sprite.animFrame === 3 ? 10 : 5
        }
    }

    public update (scene: TPL.Scene): void {
        super.update(scene)
        const { a, d, m } = this.speed
        const { properties: { gravity } } = scene
        const player = scene.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)

        let animation: TPL.Animation

        if (!this.onGround) this.force.y += this.force.y > 0 ? gravity : gravity / 2
        else if (Math.abs(this.force.y) <= 0.2) this.force.y = 0

        this.force.x = approach(this.force.x, 0, d)

        switch (this.state) {
        // RISE
        case this.states.RISE:
            animation = ANIMATIONS.RISE
            if (scene.onScreen(this) && this.sprite.animFrame === animation.strip.frames - 1) {
                this.state = this.states.IDLE
            }
            break
        // IDLE
        case this.states.IDLE:
            animation = ANIMATIONS.IDLE
            if (scene.onScreen(this)) {
                this.activated = true
                this.solid = true
                scene.startTimeout(`zombie-${this.id}-awake`, 1500, () => this.state = this.states.WALK)
            }
            break
        // WALK
        case this.states.WALK:
            animation = ANIMATIONS.WALK
            this.solid = true
            this.force.x = approach(this.force.x, this.direction === LEFT ? -m : m, a)
            scene.startTimeout(`zombie-${this.id}-run`, 3000, () => {
                if (scene.onScreen(this) && this.facingPlayer(player)) {
                    this.state = this.states.RUN
                }
            })
            break
        // RUN
        case this.states.RUN:
            animation = ANIMATIONS.RUN
            this.solid = true
            this.force.x = approach(this.force.x, this.direction === LEFT ? -m * 2 : m * 2, a)
            if (!this.facingPlayer(player)) this.state = this.states.WALK
            break
        // ATTACK
        case this.states.ATTACK:
            animation = ANIMATIONS.ATTACK
            this.solid = true
            this.direction = this.x > player.x ? LEFT : RIGHT
            scene.startTimeout(`zombie-${this.id}-run`, 1000, () => this.state = this.states.WALK)
            break
        // HURT
        case this.states.HURT:
            const dead = this.energy[0] <= 0 
            this.solid = false
            scene.stopTimeout(`zombie-${this.id}-awake`)
            scene.stopTimeout(`zombie-${this.id}-run`)
            animation = !this.facingPlayer(player) || dead
                ? ANIMATIONS.HURT1 
                : ANIMATIONS.HURT2
            if (dead && this.sprite.animFrame === 5) {
                this.state = this.states.DEFEAT
            }
            else if (this.sprite.animFrame === animation.strip.frames - 1) {
                !this.facingPlayer(player) && this.turnAround()
                this.state = this.states.RUN
            }
            break
        // DEFEAT
        case this.states.DEFEAT:
            this.solid = false
            this.activated = false
            scene.startTimeout(`zombie-${this.id}-defeat`, 1000, () => this.kill())
            break
        }
        // turn around on obstackle
        this.expectedPos.x !== this.x && this.turnAround()
        this.sprite.flipH = this.direction === LEFT
        if (this.state !== this.states.DEFEAT) {
            this.sprite.animate(animation)
        }
    }
}

export function createZombie (x: number, y: number, pid: string) {
    return new Zombie({
        x, y,
        pid,
        width: 58,
        height: 46,
        dead: false,
        activated: false,
        layerId: LAYERS.OBJECTS,
        type: ENTITIES_TYPE.ZOMBIE
    })
}