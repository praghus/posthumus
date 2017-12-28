import Entity from '../entity'
import { DIRECTIONS } from '../../lib/constants'

export default class LavaStone extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.damage = 100
        this.width = 4
        this.height = 4
        this.speed = 2
        this.maxSpeed = 2
        this.damage = 20
        this.direction = Math.round(Math.random() * 2)
        this.force = {x: 0, y: -4 - Math.random() * 4}
        this.color = 'rgb(200,100,0)'
    }

    draw (ctx) {
        const { camera } = this._game
        ctx.fillStyle = this.color
        ctx.fillRect(this.x + camera.x, this.y + camera.y, this.width, this.height)
    }

    update () {
        if (!this.dead) {
            this.force.y += this._game.world.gravity
            this.force.x += this.direction > 0 ? this.speed : -this.speed
            this.move()
            if (this.expectedX !== this.x || this.expectedY !== this.y) {
                const { elements } = this._game
                this.dead = true
                elements.emitParticles(5 + parseInt(Math.random() * 5), {
                    x: this.direction === DIRECTIONS.RIGHT ? this.x + this.width : this.x,
                    y: this.y,
                    width: 1,
                    height: 1,
                    color: this.color
                })
            }
        }
    }
}
