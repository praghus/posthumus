import ActiveElement from '../models/active-element'
import { DIRECTIONS } from '../../lib/constants'

export default class Rock extends ActiveElement {
    constructor (obj, scene) {
        super(obj, scene)
        this.doShake = false
        this.acceleration = 0.2
        this.maxSpeed = 2
        this.direction = DIRECTIONS.RIGHT
        this.damage = 50
        this.solid = true
        this.rotation = 0
    }
    draw () {
        const { assets, ctx, camera } = this._scene
        const r = Math.PI / 16
        ctx.save()
        ctx.translate(
            Math.floor(this.x + camera.x),
            Math.floor(this.y + camera.y)
        )
        ctx.translate(16, 16)
        if (this.force.x !== 0) {
            this.rotation += this.acceleration / 5
        }
        ctx.rotate(this.rotation * r)
        ctx.drawImage(assets[this.asset], -16, -16)
        ctx.restore()
    }

    update () {
        if (this.activated && !this.dead) {
            const { camera, world } = this._scene

            this.force.y += world.gravity

            if (this.onFloor && this.acceleration < this.maxSpeed) {
                this.acceleration += 0.01
            }

            this.force.x = this.direction === DIRECTIONS.RIGHT
                ? this.acceleration
                : -this.acceleration

            this.move()

            if (!this.onFloor) {
                this.doShake = true
            }
            else if (this.doShake) {
                camera.shake()
                this.doShake = false
            }
            if (this.expectedX > this.x) {
                this.kill()
            }
        }
    }
}
