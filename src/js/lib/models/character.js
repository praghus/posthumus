import Entity from './entity'
import {
    randomInt,
    between
} from '../../lib/utils/helpers'
import {
    DIRECTIONS,
    ITEMS,
    STATES,
    ENTITIES_TYPE,
    LAYERS
} from '../../lib/constants'

export default class Character extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.solid = true
        this.visible = true
    }

    draw () {
        super.draw()
        const { debug, overlay } = this.game
        this.hint && overlay.addHint(this)
        this.onScreen() && debug && overlay.displayDebug(this)
    }

    produceItem (id) {
        const { world } = this.game
        world.addObject({
            id,
            type: ENTITIES_TYPE.ITEM,
            x: this.x + this.width / 2,
            y: this.y,
            properties: { id }
        }, LAYERS.OBJECTS)
    }

    turnToPlayer () {
        const { player } = this.game
        if (this.x < player.x) {
            this.direction = DIRECTIONS.RIGHT
        }
        if (this.x > player.x) {
            this.direction = DIRECTIONS.LEFT
        }
    }

    hit (damage) {
        if (!this.dead) {
            if (this.energy && this.energy > 0) {
                this.energy -= damage
                if (this.energy <= 0) {
                    this.force.y = 2
                    this.setState(STATES.DYING)
                    const choice = randomInt(0, 10)
                    if (between(choice, 2, 5)) {
                        this.produceItem(ITEMS.AMMO)
                    }
                    if (between(choice, 6, 8)) {
                        this.produceItem(ITEMS.HEALTH)
                    }
                    if (between(choice, 9, 10)) {
                        this.produceItem(ITEMS.LIVE)
                    }
                }
                else {
                    this.force.x *= -1
                    this.force.y = -2
                }
            }
        }
    }
}
