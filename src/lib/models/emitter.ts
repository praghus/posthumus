import { Entity } from 'tiled-platformer-lib'
import { randomInt } from '../helpers'
import { ENTITIES_TYPE, LAYERS } from '../constants'
import { createZombie } from './zombie'

export class Emitter extends Entity {
    private count = 0
    private emitted = 0

    private emit (scene: TPL.Scene) {
        const randomX = randomInt(0, (this.width - 50) / 50) * 50 
        scene.addObject(createZombie(this.x + randomX, this.y - 52, this.id))
        this.emitted++
    }
    
    public update (scene: TPL.Scene): void {
        super.update(scene)
        
        this.count = scene
            .getObjectsByType(
                ENTITIES_TYPE.ZOMBIE, 
                LAYERS.OBJECTS
            ).filter(
                (obj: TPL.Entity) => obj.pid === this.id
            ).length

        if (this.emitted >= this.properties.max) this.kill()
        
        if (scene.onScreen(this) && this.count < this.properties.volume) {
            scene.startTimeout(`emmiter-${this.id}`, 1000, () => this.emit(scene))
        }
    }
}