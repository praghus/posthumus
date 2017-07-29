import SAT from 'sat'
import { overlap, normalize } from '../lib/utils'
import { JUMP_THROUGH } from '../lib/utils'

export class Entity {
    constructor (obj, game) {
        this._game = game
        this.PlayerM = 0
        this.id = obj.id
        this.x = obj.x
        this.y = obj.y
        this.width = obj.width
        this.height = obj.height
        this.type = obj.type
        this.properties = obj.properties
        this.direction = obj.direction
        this.family = 'elements'
        this.force = {x: 0, y: 0}
        this.speed = 0
        this.maxSpeed = 1
        this.energy = 0
        this.maxEnergy = 0
        this.doJump = false
        this.canShoot = false
        this.canJump = false
        this.activated = false
        this.dead = false
        this.fall = false
        this.onFloor = false
        this.solid = false
        this.shadowCaster = false
        this.visible = true
        this.animation = null
        this.animOffset = 0
        this.animFrame = 0
        this.animCount = 0
        this.vectorMask = [
            new SAT.Vector(0, 0),
            new SAT.Vector(this.width, 0),
            new SAT.Vector(this.width, this.height),
            new SAT.Vector(0, this.height)
        ]
    }
    // ----------------------------------------------------------------------
    draw (ctx) {
        const { camera, assets } = this._game
        if (this.visible && this.onScreen()) {
            if (this.animation) {
                ctx.drawImage(assets[this.type],
                    this.animation.x + (this.animFrame * this.animation.w), this.animation.y + this.animOffset,
                    this.animation.w, this.animation.h,
                    Math.floor(this.x + camera.x), Math.floor(this.y + camera.y),
                    this.animation.w, this.animation.h
                )
            }
            else {
                ctx.drawImage(assets[this.type],
                    this.animFrame * this.width, 0, this.width, this.height,
                    Math.floor(this.x + camera.x), Math.floor(this.y + camera.y),
                    this.width, this.height
                )
            }
        }
    }

    update () {
        // update
    }

    getMask () {
        return new SAT.Polygon(new SAT.Vector(this.x, this.y), this.vectorMask)
    }

    overlapTest (obj) {
        if (!this.dead && overlap(this, obj) && (this.onScreen() || this.activated)) {
            // poligon collision checking
            if (SAT.testPolygonPolygon(this.getMask(), obj.getMask())) {
                this.collide(obj)
                obj.collide(this)
            }
        }
    }

    collide (element) {
        // console.log("Object "+element.type+" collide with "+this.type);
    }

    onScreen () {
        const { world, camera, viewport } = this._game
        const { resolutionX, resolutionY } = viewport
        const { spriteSize } = world

        return this.x + this.width + spriteSize > -camera.x &&
                this.x - spriteSize < -camera.x + resolutionX &&
                this.y - spriteSize < -camera.y + resolutionY &&
                this.y + this.height + spriteSize > -camera.y
    }

    kill () {
        this.dead = true
    }

    seesPlayer () {
        const { player, world } = this._game
        const { spriteSize } = world

        this.PlayerM = ((player.y + player.height) - (this.y + this.height)) / (player.x - this.x)

        if (!player.canHurt) {
            return false
        }

        if (this.PlayerM > -0.15 && this.PlayerM < 0.15) {
            const steps = Math.abs(Math.floor(player.x / spriteSize) - Math.floor(this.x / spriteSize))
            const from = player.x < this.x ? Math.floor(player.x / spriteSize) : Math.floor(this.x / spriteSize)
            for (let X = from; X < from + steps; X++) {
                if (world.isSolid(X, Math.round(this.y / spriteSize))) {
                    return false
                }
            }
            return true
        }
        return false
    }

    animate (animation) {
        const entity = this

        animation = animation || entity.animation
        entity.animFrame = entity.animFrame || 0
        entity.animCount = entity.animCount || 0

        if (entity.animation !== animation) {
            entity.animation = animation
            entity.animFrame = 0
            entity.animCount = 0
        }
        else if (++(entity.animCount) === Math.round(60 / animation.fps)) {
            if (entity.animFrame <= entity.animation.frames && animation.loop) {
                entity.animFrame = normalize(entity.animFrame + 1, 0, entity.animation.frames)
            }
            entity.animCount = 0
        }
    }

    move () {
        const { world } = this._game
        const { spriteSize } = world

        if (this.force.x > this.maxSpeed) {
            this.force.x = this.maxSpeed
        }
        if (this.force.x < -this.maxSpeed) {
            this.force.x = -this.maxSpeed
        }

        this.expectedX = this.x + this.force.x
        this.expectedY = this.y + this.force.y

        const PX = Math.floor(this.expectedX / spriteSize)
        const PY = Math.floor(this.expectedY / spriteSize)
        const PW = Math.floor((this.expectedX + this.width) / spriteSize)
        const PH = Math.floor((this.expectedY + this.height) / spriteSize)
        const nearMatrix = []

        for (let y = PY; y <= PH; y++) {
            for (let x = PX; x <= PW; x++) {
                nearMatrix.push(this._game.world.tileData(x, y))
            }
        }

        for (let i = 0; i < nearMatrix.length; i++) {
            const c1 = {x: this.x + this.force.x, y: this.y, width: this.width, height: this.height}
            if (nearMatrix[i].solid && overlap(c1, nearMatrix[i])) {
                if (this.force.x < 0) {
                    this.force.x = nearMatrix[i].x + nearMatrix[i].width - this.x
                }
                else if (this.force.x > 0) {
                    this.force.x = nearMatrix[i].x - this.x - this.width
                }
            }
        }

        this.x += this.force.x

        for (let j = 0; j < nearMatrix.length; j++) {
            const c2 = {x: this.x, y: this.y + this.force.y, width: this.width, height: this.height}
            if (nearMatrix[j].solid && overlap(c2, nearMatrix[j])) {
                if (this.force.y < 0 && JUMP_THROUGH.indexOf(nearMatrix[j].type) === -1) {
                    this.force.y = nearMatrix[j].y + nearMatrix[j].height - this.y
                }
                else if (this.force.y > 0) {
                    this.force.y = nearMatrix[j].y - this.y - this.height
                }
            }
        }

        this.y += this.force.y

        this.onCeiling = this.expectedY < this.y
        this.onFloor = this.expectedY > this.y
        this.onLeftEdge = !world.isSolid(PX, PH)
        this.onRightEdge = !world.isSolid(PW, PH)
    }
}
