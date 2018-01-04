import Entity from '../entity'

export default class SpiderTrap extends Entity {
    constructor (obj, game) {
        super(obj, game)
        this.damage = 1000
        this.fall = false
        this.rise = false
        this.solid = true
        this.startX = this.x + (this.width / 2)
        this.startY = this.y
        this.fallDelay = parseInt(this.properties.delay) || 1000
        this.fallTimeout = setTimeout(() => {
            this.fall = true
        }, this.fallDelay)
        this.animation = {x: 0, y: 0, w: 16, h: 23, frames: 2, fps: 4, loop: true}
    }

    draw (ctx) {
        const { camera, assets } = this._game
        if (this.onScreen()) {
            ctx.beginPath()
            ctx.moveTo(this.startX + camera.x, this.startY + camera.y)
            ctx.lineTo(this.startX + camera.x, this.y + camera.y)
            ctx.stroke()
            ctx.drawImage(assets[this.type],
                this.animation.x + this.animFrame * this.animation.w, this.animation.y,
                this.animation.w, this.animation.h,
                this.x + camera.x, this.y + camera.y,
                this.animation.w, this.animation.h
            )
        }
    }

    update () {
        if (this.onScreen()) {
            if (this.rise) {
                this.force.y -= 0.005
            }
            else if (this.fall) {
                this.force.y += this._game.world.gravity
            }
            else {
                this.force.y = 0
            }

            this.move()
            this.animate()

            if (this.onFloor) {
                this.force.y = 0
                this.fall = false
                this.rise = true
            }
            if (this.y <= this.startY || this.onCeiling) {
                this.rise = false
                this.fall = false
                this.fallTimeout = setTimeout(() => {
                    this.fall = true
                }, this.fallDelay)
            }
        }
        else {
            this.fallTimeout = null
        }
    }
}
