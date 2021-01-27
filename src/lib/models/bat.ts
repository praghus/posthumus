import { Entity, Scene } from 'tiled-platformer-lib'
import { approach } from '../helpers'
import { IMAGES, DIRECTIONS, ENTITIES_TYPE, LAYERS, ENTITIES_FAMILY } from '../constants'
import ANIMATIONS from '../animations/bat'

const { LEFT, RIGHT } = DIRECTIONS

export class Bat extends Entity {
    public image = IMAGES.BAT
    public family = ENTITIES_FAMILY.ENEMIES
    public animations = ANIMATIONS
    public collisionLayers = [LAYERS.MAIN]
    public direction = LEFT
    public activated = false
    public solid = true
    public damage = 0
    public energy = [20, 20]
    public speed = { a: 0.1, d: 0.15, m: 1 }
    
    private states = { IDLE: 0, FLYING: 1, HURT: 2, FALL: 3 }
    private state: number

    constructor (obj: StringTMap<any>) {
        super(obj)
        this.state = this.states.IDLE
        this.setBoundingBox(5, 0, this.width - 10, this.height - 14)
    }

    public hit (damage: number): void {
        super.hit(damage)
        this.state = this.energy[0] > 0
            ? this.states.HURT
            : this.states.FALL
    }


    public collide (obj: Entity, scene: Scene) {
        if (!scene.checkTimeout(`bat-${this.id}-bounce`)) {
            const { a, m } = this.speed
            const bounce = -approach(this.force.x, this.direction === LEFT ? -m : m, a)
            this.force.y *= bounce
            this.force.x *= bounce
            scene.startTimeout(`bat-${this.id}-bounce`, 1000)
        }
    }

    public update (scene: Scene): void {
        super.update(scene)
        const { a, d, m } = this.speed
        const { camera } = scene
        const player = scene.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)

        switch (this.state) {
        case this.states.IDLE:
            if (scene.onScreen(this)) {
                this.activated = true
                this.sprite.animate(this.animations.IDLE)
                scene.startTimeout(`bat-${this.id}-awake`, 1000, () => {
                    this.state = this.states.FLYING
                })
            }
            break

        case this.states.FLYING:
            this.damage = 10
            this.force.y += this.y > player.y + 24 ? -a : a / 2
            this.force.x = approach(this.force.x, this.direction === LEFT ? -m : m, a)

            if (!scene.checkTimeout(`bat-${this.id}-bounce`)) {
                this.direction = player.x > this.x ? RIGHT : LEFT
                if (-(this.y + this.force.y) > camera.y) {
                    this.force.y += this.speed.a
                }
            }

            if (this.expectedPos.x !== this.x) {
                this.force.x *= -0.6
                this.force.y -= 0.05
                this.direction = this.direction === RIGHT ? LEFT : RIGHT
            }
            else if (this.expectedPos.y !== this.y) {
                this.force.y += this.direction === DIRECTIONS.RIGHT ? d : -d
            }

            this.sprite.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT
            )
            break

        case this.states.HURT:
            if (!scene.checkTimeout(`bat-${this.id}-hurt`)) {
                this.direction = this.direction === RIGHT ? LEFT : RIGHT
                scene.startTimeout(`bat-${this.id}-hurt`, 500, () => this.state = this.states.FLYING)
            }
            this.sprite.animate(this.direction === DIRECTIONS.RIGHT
                ? this.animations.RIGHT
                : this.animations.LEFT
            )
            break

        case this.states.FALL:
            this.damage = 0
            this.force.x = 0
            this.force.y += 0.2
            this.sprite.animate(this.animations.FALL)
            if (this.onGround) this.kill()
            break
        }
    }
}
