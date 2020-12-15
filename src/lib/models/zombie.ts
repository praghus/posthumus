import { Entity } from 'tiled-platformer-lib'
import { approach } from '../helpers'
import { IMAGES, DIRECTIONS, ENTITIES_TYPE, LAYERS, ENTITIES_FAMILY } from '../constants'
import { createItem } from './item'
import ANIMATIONS from '../animations/zombie'

const { LEFT, RIGHT } = DIRECTIONS

export class Zombie extends Entity {
    public image = IMAGES.ZOMBIE
    public family = ENTITIES_FAMILY.ENEMIES
    public animations = ANIMATIONS
    public collisionLayers = [LAYERS.MAIN]
    public direction = LEFT
    public damage = 0
    public energy = [20, 20]
    public speed = { a: 10, d: 5, m: 20 }
    public solid = true

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
        if (this.state !== this.states.HURT) {
            super.hit(damage)
        }
        this.sprite.animFrame = 0
        this.state = this.states.HURT
    }

    public collide (obj: TPL.Entity) {
        if (this.activated && obj.type === ENTITIES_TYPE.PLAYER && obj.visible) {
            this.state = this.states.ATTACK
            this.damage = this.sprite.animFrame === 3 ? 20 : 10
        }
    }

    public dropItem (scene: TPL.Scene) {
        const probability = [0, 0, 0, 0, 0, 0, 1, 1, 1, 2]
        const idx = Math.floor(Math.random() * probability.length)
        const item = [null, ENTITIES_TYPE.AMMO, ENTITIES_TYPE.HEALTH][probability[idx]]
        item && scene.addObject(createItem(this.x + 25, this.y, item))
    }

    public update (scene: TPL.Scene, delta: number): void {
        super.update(scene)
        const { a, d, m } = this.speed
        const { RISE, IDLE, WALK, RUN, ATTACK, HURT, DEFEAT } = this.states
        const player = scene.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)
        const gravity = scene.getProperty('gravity') * delta

        let animation: TPL.Animation

        switch (this.state) {
        case RISE:
            animation = ANIMATIONS.RISE
            this.direction = this.x > player.x ? LEFT : RIGHT
            if (scene.onScreen(this) && this.sprite.animFrame === animation.strip.frames - 1) {
                this.activated = true
                this.state = IDLE
            }
            break

        case IDLE:
            animation = ANIMATIONS.IDLE
            if (scene.onScreen(this)) {
                scene.startTimeout(`zombie-${this.id}-awake`, 1500, () => this.state = WALK)
            }
            break

        case WALK:
            animation = ANIMATIONS.WALK
            this.speed.m = 20
            scene.startTimeout(`zombie-${this.id}-run`, 2000, () => {
                if (scene.onScreen(this) && this.facingPlayer(player)) {
                    this.state = RUN
                }
            })
            break

        case RUN:
            animation = ANIMATIONS.RUN
            this.speed.m = 80
            if (!this.facingPlayer(player)) this.state = WALK
            break

        case ATTACK:
            animation = ANIMATIONS.ATTACK
            this.direction = this.x > player.x ? LEFT : RIGHT
            scene.startTimeout(`zombie-${this.id}-run`, 1000, () => this.state = WALK)
            break

        case HURT:
            const dead = this.energy[0] <= 0 
            this.solid = false
            scene.stopTimeout(`zombie-${this.id}-awake`)
            scene.stopTimeout(`zombie-${this.id}-run`)
            animation = !this.facingPlayer(player) || dead
                ? ANIMATIONS.HURT1 
                : ANIMATIONS.HURT2
            if (dead && this.sprite.animFrame === 5) {
                this.state = DEFEAT
                this.dropItem(scene)
            }
            else if (this.sprite.animFrame === animation.strip.frames - 1) {
                !this.facingPlayer(player) && this.turnAround()
                this.state = RUN
                this.solid = true
            }
            break

        case DEFEAT:
            scene.startTimeout(`zombie-${this.id}-defeat`, 1000, () => this.kill())
            this.activated = false
            break
        }

        if (!this.onGround) this.force.y += this.force.y > 0 ? gravity : gravity / 2
        else if (Math.abs(this.force.y) <= 0.2) this.force.y = 0

        this.force.x = this.state === WALK || this.state === RUN 
            ? approach(this.force.x, this.direction === LEFT ? -m : m, a, delta)
            : approach(this.force.x, 0, d, delta)

        // turn around on obstackle
        this.expectedPos.x !== this.x && this.turnAround()
        this.sprite.flipH = this.direction === LEFT
        if (this.state !== DEFEAT) {
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