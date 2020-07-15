import { Entity } from 'tiled-platformer-lib'
import { ENTITIES_TYPE, LAYERS, SOUNDS } from '../constants'

export class Item extends Entity {
    public collisionLayers = [LAYERS.MAIN]

    constructor (obj: TPL.StringTMap<any>) {
        super(obj)
        this.y -= obj.height
    }

    public collide (obj: TPL.Entity, scene: TPL.Scene, response: SAT.Response) {
        const overlap = response.overlapV
        const { map: { tilewidth, tileheight } } = scene
        if (obj.type === ENTITIES_TYPE.PLAYER) {
            const player: any = obj
            switch (this.type) {
            case ENTITIES_TYPE.BOX:
                if (overlap.y !== 0) {
                    obj.force.y = 0
                    obj.y -= overlap.y
                    obj.onGround = true
                }
                else if (overlap.x !== 0) {
                    if (!scene.isSolidArea(
                        Math.floor((this.x + overlap.x) / tilewidth),
                        Math.floor(this.y / tileheight),
                        this.collisionLayers
                    )) {
                        this.x += overlap.x
                        this.onGround = false
                    }
                }
                break
            case ENTITIES_TYPE.AMMO:
                player.ammo[1]++
                break
            case ENTITIES_TYPE.COIN:
                player.points += 100
                break
            case ENTITIES_TYPE.HEALTH:
                player.energy[0] = player.energy[1]
                break
            }
            if (this.type !== ENTITIES_TYPE.BOX) {
                SOUNDS.POWERUP.play()
                this.kill()
            }
        }
    }

    public update (scene: TPL.Scene): void {
        super.update(scene)
        if (!this.onGround) {
            const gravity = scene.getProperty('gravity')

            this.force.y += this.force.y > 0
                ? gravity
                : gravity / 2
        }
        else {
            this.force.y *= -0.8
        }
    }
}