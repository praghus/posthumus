import { Entity } from 'tiled-platformer-lib'
import { IMAGES, DIRECTIONS, ENTITIES_TYPE, LAYERS } from '../constants'
import ANIMATIONS from '../animations/dust'

export class Dust extends Entity {
    public image = IMAGES.DUST
    public animations = ANIMATIONS

    update () {
        if (!this.dead) {
            this.sprite.animate(
                this.direction === DIRECTIONS.RIGHT
                    ? this.animations.RIGHT
                    : this.animations.LEFT
            )
            if (this.sprite.animFrame === 8) {
                this.kill()
            }
        }
    }
}

export function createDust (x: number, y: number, direction: string) {
    return new Dust({
        x, y, direction,
        width: 16,
        height: 16,
        layerId: LAYERS.OBJECTS,
        type: ENTITIES_TYPE.DUST
    })
}
