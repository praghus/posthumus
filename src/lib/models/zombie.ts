import { Entity, Game, Vec2 } from 'platfuse'
import { DIRECTIONS, ENTITY_FAMILY, ENTITY_TYPES, LAYERS } from '../constants'
import ANIMATIONS from '../animations/zombie'
import Player from './player'
import MainScene from '../scenes/main'
import Bullet from './bullet'
import { dropItem } from './item'

const { LEFT, RIGHT } = DIRECTIONS

enum STATES {
    RISE = 0,
    IDLE = 1,
    WALK = 2,
    RUN = 3,
    ATTACK = 4,
    HURT = 5,
    DEFEAT = 6
}

export default class Zombie extends Entity {
    image = 'zombie.png'
    state = STATES.RISE
    family = ENTITY_FAMILY.ENEMIES
    type = ENTITY_TYPES.ZOMBIE
    layerId = LAYERS.OBJECTS
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    collisions = true
    direction = LEFT
    pid: string
    damage = 0
    energy = [20, 20]
    speed = { a: 0.1, d: 0.1, m: 0.4 }
    activated = false
    turning = false

    constructor(obj: Record<string, any>, game: Game) {
        super({ ...obj, width: 58, height: 46 }, game)
        this.pid = obj.pid
    }

    update() {
        super.update()
        const scene = this.game.getCurrentScene() as MainScene
        const { a, d, m } = this.speed
        const { RISE, IDLE, WALK, RUN, ATTACK, HURT, DEFEAT } = STATES
        const player = scene.getObjectByType(ENTITY_TYPES.PLAYER) as Player
        let animation = ANIMATIONS.IDLE
        switch (this.state) {
            case RISE:
                animation = ANIMATIONS.RISE
                this.direction = this.pos.x > player.pos.x ? LEFT : RIGHT
                if (this.onScreen() && this.getAnimationFrame() === animation.strip.frames - 1) {
                    this.activated = true
                    this.state = IDLE
                }
                break
            case IDLE:
                animation = ANIMATIONS.IDLE
                if (this.onScreen()) {
                    this.game.wait(`zombie-${this.id}-awake`, () => (this.state = WALK), 1500)
                }
                break
            case WALK:
                animation = ANIMATIONS.WALK
                this.speed.m = 0.4
                this.game.wait(
                    `zombie-${this.id}-run`,
                    () => {
                        if (this.onScreen() && this.isFacingPlayer(player)) {
                            this.state = RUN
                        }
                    },
                    2000
                )
                break
            case RUN:
                animation = ANIMATIONS.RUN
                this.speed.m = 1
                if (!this.isFacingPlayer(player)) this.state = WALK
                break
            case ATTACK:
                animation = ANIMATIONS.ATTACK
                this.direction = this.pos.x > player.pos.x ? LEFT : RIGHT
                this.game.wait(`zombie-${this.id}-run`, () => (this.state = WALK), 1000)
                break
            case HURT:
                const dead = this.energy[0] <= 0
                this.game.cancelWait(`zombie-${this.id}-awake`)
                this.game.cancelWait(`zombie-${this.id}-run`)
                animation = !this.isFacingPlayer(player) || dead ? ANIMATIONS.HURT1 : ANIMATIONS.HURT2
                if (dead && this.getAnimationFrame() === 5) {
                    dropItem(this.game, new Vec2(this.pos.x + this.width / 2, this.pos.y))
                    this.state = DEFEAT
                } else if (this.getAnimationFrame() === animation.strip.frames - 1) {
                    !this.isFacingPlayer(player) && this.turnAround()
                    this.state = RUN
                }
                break
            case DEFEAT:
                this.game.wait(`zombie-${this.id}-defeat`, () => this.kill(), 500)
                this.activated = false
                break
        }
        if (!this.onGround()) this.force.y += this.force.y > 0 ? scene.gravity : scene.gravity / 2
        else if (Math.abs(this.force.y) <= 0.2) this.force.y = 0
        this.force.x =
            this.state === WALK || this.state === RUN
                ? this.approach(this.force.x, this.direction === LEFT ? -m : m, a)
                : this.approach(this.force.x, 0, d)
        if (
            this.expectedPos.x !== this.pos.x ||
            (Math.abs(this.pos.x - this.initialPos.x) > 100 && !this.isFacingPlayer(player))
        ) {
            this.turnAround()
        }
        if (this.state !== DEFEAT) {
            this.animate(animation, { H: this.direction === LEFT })
        }
    }

    hit(damage: number) {
        if (this.state !== STATES.HURT && this.state !== STATES.DEFEAT) {
            this.setAnimationFrame(0)
            this.state = STATES.HURT
        }
        this.energy[0] -= damage
    }

    collide(obj: Entity) {
        if (this.activated && obj.visible) {
            switch (obj.type) {
                case ENTITY_TYPES.BULLET:
                    const bullet = obj as Bullet
                    this.hit(bullet.damage)
                    break
                case ENTITY_TYPES.PLAYER:
                    const player = obj as Player
                    this.state = STATES.ATTACK
                    this.damage = this.getAnimationFrame() === 3 ? 20 : 10
                    player.hit(this.damage)
                    break
            }
        }
    }

    isFacingPlayer(player: Entity): boolean {
        return (
            (this.direction === LEFT && this.pos.x > player.pos.x) ||
            (this.direction === RIGHT && this.pos.x < player.pos.x)
        )
    }

    turnAround() {
        if (!this.turning) {
            this.direction = this.direction === RIGHT ? LEFT : RIGHT
            this.force.x *= -0.6
            this.turning = true
        }
        this.game.wait(`zombie-${this.id}-turn`, () => (this.turning = false), 500)
    }
}
