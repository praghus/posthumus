import { Emitter, Entity, vec2, Vector } from 'platfuse'
import { BloodParticle, Directions, Items } from '../constants'
import Item from './item'

const { Left, Right } = Directions

export default class GameObject extends Entity {
    bounded = true
    facing = Left
    damage = 0

    turn() {
        this.facing = this.facing === Left ? Right : Left
    }

    blood(pos: Vector) {
        this.scene.addObject(new Emitter(this.scene, { ...BloodParticle, pos }))
    }

    destroy() {
        const chance = Math.random() * 100
        let gid = Items.Coin
        if (chance < 10) {
            gid = Items.Health
        } else if (chance < 30) {
            gid = Items.Ammo
        }
        this.scene.addObject(new Item(this.scene, { pos: this.pos.subtract(vec2(0, 1)), gid }), 3)
        this.dead = true
    }
}
