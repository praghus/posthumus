import Character from '../models/character'
import {
    COLORS,
    PARTICLES,
    STATES
} from '../constants'

export default class SpiderTrap extends Character {
    constructor (obj, game) {
        super(obj, game)
        this.damage = 10
        this.energy = 30
        this.startX = this.x + (this.width / 2)
        this.startY = this.y
        this.states = [
            STATES.IDLE,
            STATES.WAITING,
            STATES.RISING,
            STATES.FALLING,
            STATES.DYING
        ]
        this.animation = {x: 0, y: 0, w: 16, h: 23, frames: 2, fps: 4, loop: true}
        this.setState(STATES.IDLE)
    }

    draw () {
        const { camera, ctx, props: { assets } } = this.game
        if (this.onScreen()) {
            ctx.beginPath()
            ctx.strokeStyle = COLORS.BLACK
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

    hit (damage) {
        super.hit(damage)
    }

    wait () {
        const { startTimeout } = this.game
        this.rise = false
        this.fall = false
        startTimeout(`spider-${this.id}-wait`, 800, () => {
            this.fall = true
        })
    }

    update () {
        const {
            startTimeout,
            stopTimeout,
            world
        } = this.game

        if (this.onScreen()) {
            switch (this.state) {
            case STATES.IDLE:
                this.force.y = 0
                startTimeout(`spider-trap-${this.id}-wait`, 800, () => {
                    this.setState(STATES.FALLING)
                })
                break
            case STATES.FALLING:
                this.force.y += world.gravity
                break
            case STATES.RISING:
                this.force.y -= 0.005
                break
            case STATES.DYING:
                this.emitParticles(
                    PARTICLES.DIRT,
                    this.x + this.width / 2,
                    this.y,
                    10,
                    this.width
                )
                this.kill()
                break
            }

            this.move()
            this.animate()

            if (this.onFloor) {
                this.force.y = 0
                this.setState(STATES.RISING)
            }
            if (this.y <= this.startY || this.onCeiling) {
                this.setState(STATES.IDLE)
            }
        }
        else {
            stopTimeout(`spider-trap-${this.id}-wait`)
        }
    }
}
