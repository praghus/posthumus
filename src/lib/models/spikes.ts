import { Entity, randInt, vec2 } from 'platfuse'
import Animations from '../animations/shine'
import GameObject from './game-object'

class Shine extends Entity {
    image = 'shine.png'
    animation = Animations.Shine
    collideTiles = false
    collideObjects = false
    size = vec2(0.5)
    mass = 0
    ttl = 0.5
}

export default class Spikes extends GameObject {
    family = 'enemy'
    collideTiles = false
    shineTimer = this.scene.game.timer()
    damage = 10
    mass = 0

    update() {
        if (this.onScreen()) {
            if (this.shineTimer.isDone()) {
                this.shineTimer.unset()
                this.scene.addObject(
                    new Shine(this.scene, {
                        pos: this.pos.clone().add(vec2(randInt(0, this.size.x) - this.size.x / 2, -1))
                    }),
                    3
                )
            }
            if (!this.shineTimer.isActive()) this.shineTimer.set(1)
        }
    }
}
