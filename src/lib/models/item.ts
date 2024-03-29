import { Entity, Game, Vector } from 'platfuse'
import { ENTITY_TYPES, LAYERS } from '../constants'
import MainScene from '../scenes/main'
import Player from './player'

export const GIDS = {
    AMMO: 187,
    COIN: 182,
    HEALTH: 177
}

export default class Item extends Entity {
    type = ENTITY_TYPES.ITEM
    layerId = LAYERS.OBJECTS
    collisionLayers = [LAYERS.MAIN, LAYERS.OBJECTS]
    collisions = true

    constructor(obj: Record<string, any>, game: Game) {
        super({ ...obj, width: 16, height: 16 }, game)
    }

    public collide(obj: Entity) {
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
            this.game.playSound('powerup.mp3')
            this.kill()
        }
    }

    public update() {
        super.update()
        if (!this.onGround()) {
            const { gravity } = this.game.getCurrentScene() as MainScene
            this.force.y += this.force.y > 0 ? gravity : gravity / 2
        } else if (Math.abs(this.force.y) > 0.1) {
            this.force.y *= -0.6
        }
        this.force.x = this.approach(this.force.x, 0, 0.2)
    }
}

export function dropItem(game: Game, pos: Vector) {
    const scene = game.getCurrentScene()
    const probability = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2]
    const idx = Math.floor(Math.random() * probability.length)
    const gid = [GIDS.COIN, GIDS.AMMO, GIDS.HEALTH][probability[idx]]
    scene.addObject(ENTITY_TYPES.ITEM, { x: pos.x, y: pos.y, gid })
}
