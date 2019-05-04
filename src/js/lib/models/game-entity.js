import { Entity } from 'tmx-platformer-lib'
import { randomInt } from '../../lib/helpers'
import { ENTITIES_TYPE } from '../../lib/entities'
import { DIRECTIONS, LAYERS } from '../../lib/constants'

export default class GameEntity extends Entity {
    constructor (obj, scene) {
        super(obj, scene)
        this.activated = false
        this.visible = true
    }

    // @todo: entity state

    hit (damage) {
        if (!this.dead && !this.dying) {
            this.force.x += -(this.force.x * 4)
            this.force.y = -2
            this.energy -= damage
            if (this.energy <= 0) {
                this.dying = true
                // @todo: drop item here
            }
        }
    }

    collide (element) {
        if (this.canHurt()) {
            this.hit(element.damage)
        }
    }

    canHurt () {
        return this.energy > 0
    }

    addItem (properties, x, y) {
        const { produce, produce_name, produce_gid } = properties
        this._scene.world.addObject({
            type: ENTITIES_TYPE.ITEM,
            visible: true,
            gid: produce_gid || null,
            name: produce_name || '',
            x: x || this.x,
            y: y || this.y,
            properties: { id: produce }
        }, LAYERS.OBJECTS)
    }

    emitParticles (count, properties) {
        const particle_count = count || 10
        for (let i = 0; i < particle_count; i++) {
            const props = {...properties}
            props.x = properties.x + randomInt(0, 8)
            this._scene.world.addObject({
                type: ENTITIES_TYPE.PARTICLE,
                life: randomInt(60, 120),
                dead: false,
                ...props
            }, LAYERS.OBJECTS)
        }
    }

    bounce () {
        this.direction = this.direction === DIRECTIONS.RIGHT
            ? DIRECTIONS.LEFT
            : DIRECTIONS.RIGHT
        this.force.x *= -1
    }

    seesEntity (entity) {
        const { world: { isSolidArea, spriteSize } } = this._scene
        const entityM = ((entity.y + entity.height) - (this.y + this.height)) / (entity.x - this.x)

        if (!entity.canHurt() ||
            (this.x < entity.x && this.direction !== DIRECTIONS.RIGHT) ||
            (this.x > entity.x && this.direction !== DIRECTIONS.LEFT)) {
            return false
        }

        if (entityM > -0.9 && entityM < 0.9) {
            const steps = Math.abs(Math.floor(entity.x / spriteSize) - Math.floor(this.x / spriteSize))
            const from = entity.x < this.x ? Math.floor(entity.x / spriteSize) : Math.floor(this.x / spriteSize)
            for (let X = from; X < from + steps; X++) {
                if (isSolidArea(X, Math.round(this.y / spriteSize))) {
                    return false
                }
            }
            return true
        }
        return false
    }
}
