import { ENTITIES } from '../lib/utils'
import { Zombie } from './entities'

export default class Elements {
    constructor (entities, game) {
        this._game = game
        this.all = []
        this.lights = []
        for (let i = 0; i < entities.length; i++) {
            this.add(entities[i])
        }
    }

    update () {
        const { all } = this
        all.forEach((elem, i) => {
            if (elem.dead) {
                this._game.elements.all[i] = this._game.elements.all[this._game.elements.all.length - 1]
                this._game.elements.all.length--
            }
            else {
                elem.update()
            }
        })
        for (let j = 0; j < all.length; j++) {
            all[j].overlapTest(this._game.player)
            for (let k = j + 1; k < all.length; k++) {
                all[j].overlapTest(all[k])
            }
        }
    }

    getById (id) {
        return this.all.find((x) => x.id === id)
    }

    getByProperties (k, v) {
        return this.all.find((x) => x.properties && x.properties[k] === v)
    }

    add (obj) {
        switch (obj.type) {
        case ENTITIES.ZOMBIE:
            this.all.push(new Zombie(obj, this._game))
            break
        }
    }
}
