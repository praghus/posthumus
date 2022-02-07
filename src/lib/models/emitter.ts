import { Game, Entity, Scene } from 'platfuse'
import { randomInt } from '../utils'
import { ENTITY_FAMILY, ENTITY_TYPES } from '../constants'
import Zombie from './zombie'

export default class Emitter extends Entity {
    family = ENTITY_FAMILY.ENEMIES
    count = 0
    emitted = 0

    emit = (game: Game) => {
        const scene = game.getCurrentScene()
        const randomX = randomInt(0, (this.width - 50) / 50) * 50
        scene.addObject(new Zombie({ x: this.pos.x + randomX, y: this.pos.y - 52, pid: this.id }))
        this.emitted++
    }

    update(game: Game): void {
        super.update(game)
        const scene = game.getCurrentScene()
        const zombies = scene.getObjectsByType(ENTITY_TYPES.ZOMBIE) as Zombie[]

        this.count = zombies ? zombies.filter(obj => obj.pid === this.id).length : 0

        if (this.emitted >= this.properties.max) this.kill()
        if (this.onScreen(game) && this.count < this.properties.volume) {
            game.wait(`emmiter--${this.id}`, this.emit, 1000)
        }
    }
}
