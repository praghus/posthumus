import { ENTITIES } from '../lib/utils'
import { Bullet, DarkMask, JumpThrough, Particle, Slope, Zombie } from './entities'

export default class Elements {
    constructor (entities, game) {
        this._game = game
        this.objects = []
        this.darks = []
        for (let i = 0; i < entities.length; i++) {
            this.add(entities[i])
        }
    }

    update () {
        const { player } = this._game
        this.objects.forEach((obj, i) => {
            if (obj) {
                if (obj.dead) {
                    this.objects[i] = this.objects[this.objects.length - 1]
                    this.objects.length--
                }
                else {
                    obj.update()
                    obj.overlapTest(player)
                    for (let k = i + 1; k < this.objects.length; k++) {
                        this.objects[i].overlapTest(this.objects[k])
                    }
                }
            }
        })
        this.darks.forEach((dark) => {
            dark.update()
            dark.overlapTest(player)
        })
    }

    getById (id) {
        return this.objects.find((x) => x.id === id)
    }

    getByProperties (k, v) {
        return this.objects.find((x) => x.properties && x.properties[k] === v)
    }

    add (obj) {
        const { world } = this._game
        switch (obj.type) {
        case ENTITIES.BULLET:
            this.objects.push(new Bullet(obj, this._game))
            break
        case ENTITIES.DARK_MASK:
            this.darks.push(new DarkMask(obj, this._game))
            world.addMask(obj)
            break
        case ENTITIES.JUMP_THROUGH:
            this.objects.push(new JumpThrough(obj, this._game))
            break
        case ENTITIES.PARTICLE:
            this.objects.push(new Particle(obj, this._game))
            break
        case ENTITIES.SLOPE_LEFT:
        case ENTITIES.SLOPE_RIGHT:
            this.objects.push(new Slope(obj, this._game))
            break
        case ENTITIES.ZOMBIE:
            this.objects.push(new Zombie(obj, this._game))
            break
        }
    }
}
