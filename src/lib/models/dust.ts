import { Entity, Game } from 'platfuse'
import { DIRECTIONS, ENTITY_TYPES, LAYERS } from '../constants'
import ANIMATIONS from '../animations/dust'
import { StringTMap } from '../types'

export default class Dust extends Entity {
    image = 'dust.png'
    layerId = LAYERS.OBJECTS
    type = ENTITY_TYPES.DUST
    direction = DIRECTIONS.RIGHT
    width = 16
    height = 16

    constructor(obj: StringTMap<any>, game: Game) {
        super(obj, game)
        this.direction = obj.direction
    }

    update() {
        this.animate(ANIMATIONS.DUST, { H: this.direction === DIRECTIONS.LEFT }, (frame: number) => {
            if (frame === 8) this.kill()
        })
    }
}
