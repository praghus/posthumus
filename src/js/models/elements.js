import '../lib/illuminated'
import { COLORS, ENTITIES_TYPE, LIGHTS, getEntityByType } from '../lib/constants'

const { Lamp, Vec2 } = window.illuminated

export default class Elements {
    constructor (entities, game) {
        this._game = game
        this.objects = []
        this.darks = []
        this.lights = {
            [LIGHTS.PLAYER_LIGHT]: new Lamp({
                position: new Vec2(0, 0),
                color: COLORS.PLAYER_LIGHT,
                distance: 300,
                samples: 1,
                radius: 1
            }),
            [LIGHTS.SHOOT_LIGHT]: new Lamp({
                position: new Vec2(0, 0),
                color: COLORS.PLAYER_SHOOT,
                distance: 500,
                samples: 1,
                radius: 1
            })
        }
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

    create (obj) {
        const entity = getEntityByType(obj.type)
        if (entity) {
            const Model = entity.model
            return new Model(Object.assign({}, obj, entity), this._game)
        }
        return null
    }

    setLight (id, color, distance = 300) {
        this.lights[id] = new Lamp({
            position: new Vec2(0, 0),
            color,
            distance,
            samples: 1,
            radius: 1
        })
    }

    getLight (id) {
        return this.lights[id] || null
    }

    add (obj) {
        const { world } = this._game
        const entity = this.create(obj)
        if (entity) {
            this.objects.push(entity)
            if (entity.type === ENTITIES_TYPE.DARK_MASK) {
                world.addMask(obj)
            }
        }
    }

    emitParticles (count, properties) {
        const particle_count = count || 1
        for (let i = 0; i < particle_count; i++) {
            const props = Object.assign({}, properties)
            props.x = properties.x + Math.random() * 8
            this.add(Object.assign({}, {type: ENTITIES_TYPE.PARTICLE}, props))
        }
    }

    particlesExplosion (x, y) {
        const particle_count = 10 + parseInt(Math.random() * 5)
        for (let i = 0; i < particle_count; i++) {
            const r = (1 + Math.random())
            this.add({
                x: x,
                y: y,
                width: r,
                height: r,
                mass: 0.2,
                type: ENTITIES_TYPE.PARTICLE,
                color: `rgb(${parseInt(128 + ((Math.random() * 32) * 4))}, 0, 0)`
            })
        }
    }
}
