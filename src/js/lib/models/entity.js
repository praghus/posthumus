import { Entity as GameEntity } from 'tmx-platformer-lib'
import { randomInt } from '../../lib/utils/helpers'
import { DIRECTIONS, LAYERS, ENTITIES_TYPE } from '../../lib/constants'

export default class Entity extends GameEntity {
    constructor (obj, game) {
        super(obj, game)
        this.activated = false
        this.visible = true
    }

    // @todo: entity state

    addItem (properties, x, y) {
        const { produce, produce_name, produce_gid } = properties
        this.game.world.addObject({
            type: ENTITIES_TYPE.ITEM,
            visible: true,
            gid: produce_gid || null,
            name: produce_name || '',
            x: x || this.x,
            y: y || this.y,
            properties: { id: produce }
        }, LAYERS.OBJECTS)
    }

    emitParticles (particle, x, y, count = 10, radius = 8) {
        for (let i = 0; i < count; i++) {
            const props = {
                x: x - (radius / 2) + randomInt(0, radius),
                y: y - (radius / 2) + randomInt(0, radius),
                force: particle.forceVector(),
                ...particle
            }
            this.game.world.addObject({
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
        const { world } = this.game
        const entityM = ((entity.y + entity.height) - (this.y + this.height)) / (entity.x - this.x)

        if (!entity.canHurt() ||
            (this.x < entity.x && this.direction !== DIRECTIONS.RIGHT) ||
            (this.x > entity.x && this.direction !== DIRECTIONS.LEFT)) {
            return false
        }

        if (entityM > -0.9 && entityM < 0.9) {
            const steps = Math.abs(
                Math.floor(entity.x / world.spriteSize) - Math.floor(this.x / world.spriteSize)
            )
            const from = entity.x < this.x
                ? Math.floor(entity.x / world.spriteSize)
                : Math.floor(this.x / world.spriteSize)

            for (let X = from; X < from + steps; X++) {
                if (world.isSolidArea(X, Math.round(this.y / world.spriteSize))) {
                    return false
                }
            }
            return true
        }
        return false
    }
}
