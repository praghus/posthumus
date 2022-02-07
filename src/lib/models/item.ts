import { Entity, Game, Scene, Vec2 } from 'platfuse'
import { StringTMap } from '../types'
import { ENTITY_TYPES, LAYERS } from '../constants'
import Player from './player'

export const GIDS = {
    AMMO: 187,
    COIN: 182,
    HEALTH: 177
}

export default class Item extends Entity {
    layerId = LAYERS.OBJECTS
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    collisions = true

    constructor(obj: StringTMap<any>) {
        super({ ...obj, width: 16, height: 16 })
    }

    public collide(obj: Entity, game: Game) {
        if (obj.type === ENTITY_TYPES.PLAYER && !this.dead) {
            const player = obj as Player
            switch (this.gid) {
                case GIDS.AMMO:
                    player.ammo[1]++
                    break
                case GIDS.COIN:
                    player.points += 100
                    break
                case GIDS.HEALTH:
                    player.energy[0] = player.energy[1]
                    break
            }
            game.playSound('powerup.mp3')
            this.kill()
        }
    }

    public update(game: Game): void {
        super.update(game)
        if (!this.onGround()) {
            const { gravity } = game.getCurrentScene()
            this.force.y += this.force.y > 0 ? gravity : gravity / 2
        } else if (Math.abs(this.force.y) > 0.1) {
            this.force.y *= -0.6
        }
        this.force.x = this.approach(this.force.x, 0, 0.2)
    }
}

export function dropItem(scene: Scene, pos: Vec2) {
    const probability = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2]
    const idx = Math.floor(Math.random() * probability.length)
    const gid = [GIDS.COIN, GIDS.AMMO, GIDS.HEALTH][probability[idx]]
    scene.addObject(new Item({ x: pos.x, y: pos.y, gid: GIDS.AMMO }))
}
