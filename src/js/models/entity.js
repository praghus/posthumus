import SAT from 'sat'
import { overlap, normalize } from '../lib/helpers'
import { DIRECTIONS, ENTITIES_TYPE } from '../lib/constants'

export default class Entity {
    constructor (obj, game) {
        this._game = game
        this.id = obj.id
        this.x = obj.x
        this.y = obj.y
        this.color = obj.color
        this.width = obj.width
        this.height = obj.height
        this.family = obj.family || null
        this.type = obj.type
        this.properties = obj.properties
        this.direction = obj.direction || DIRECTIONS.LEFT
        this.force = { x: 0, y: 0 }
        this.speed = 0
        this.maxSpeed = 1
        this.activated = false
        this.dead = false
        this.jump = false
        this.fall = false
        this.onFloor = false
        this.solid = false
        this.shadowCaster = false
        this.visible = true
        this.animation = null
        this.animFrame = 0
        this.animCount = 0
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
            else if (entity.animFrame < entity.animation.frames - 1 && !animation.loop) {
                entity.animFrame += 1
            }
            entity.animCount = 0
        }
    }

    draw (ctx) {
        const { camera, assets, renderer } = this._game
        const sprite = assets[this.type] || assets['no_image']
        if (this.visible && this.onScreen()) {
            if (this.shadowCaster && renderer.dynamicLights) {
                renderer.addLightmaskElement(
                    this.x + camera.x, this.y + camera.y,
                    this.width, this.height
                )
            }
            if (this.animation) {
                ctx.drawImage(sprite,
                    this.animation.x + this.animFrame * this.animation.w, this.animation.y,
                    this.animation.w, this.animation.h,
                    this.x + camera.x, this.y + camera.y,
                    this.animation.w, this.animation.h
                )
            }
            else {
                ctx.drawImage(sprite,
                    0, 0, assets[this.type] ? this.width : 16, assets[this.type] ? this.height : 16,
                    Math.floor(this.x + camera.x), Math.floor(this.y + camera.y),
                    this.width, this.height
                )
            }
        }
    }

    update () {
        // update
    }

    getBounds () {
        return this.bounds || {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }
    }

    getVectorMask () {
        const { x, y, width, height } = this.getBounds()
        const vectorMask = this.vectorMask || [
            new SAT.Vector(x, y),
            new SAT.Vector(x + width, y),
            new SAT.Vector(x + width, y + height),
            new SAT.Vector(x, y + height)
        ]
        return new SAT.Polygon(new SAT.Vector(this.x, this.y), vectorMask)
    }

    overlapTest (obj) {
        if (!this.dead && overlap(this, obj) && (this.onScreen() || this.activated)) {
            // poligon collision checking
            if (SAT.testPolygonPolygon(this.getVectorMask(), obj.getVectorMask())) {
                this.collide(obj)
                obj.collide(this)
            }
        }
    }

    collide (element) {
        // console.log("Object "+element.type+" collide with "+this.type);
    }

    hit (damage) {
        if (!this.dead && !this.dying) {
            const { elements } = this._game
            this.force.x += -(this.force.x * 4)
            this.force.y = -2
            this.energy -= damage
            if (this.energy <= 0) {
                this.dying = true
                elements.add({type: ENTITIES_TYPE.COIN, x: this.x + 8, y: this.y})
                elements.particlesExplosion(this.x, this.y)
            }
        }
    }

    kill () {
        this.dead = true
    }

    seesPlayer () {
        const { player, world } = this._game
        const { spriteSize } = world

        const playerM = ((player.y + player.height) - (this.y + this.height)) / (player.x - this.x)

        if (!player.canHurt() ||
            (this.x < player.x && this.direction !== DIRECTIONS.RIGHT) ||
            (this.x > player.x && this.direction !== DIRECTIONS.LEFT)) {
            return false
        }

        if (playerM > -0.9 && playerM < 0.9) {
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

        const {
            x: boundsX,
            y: boundsY,
            width: boundsWidth,
            height: boundsHeight
        } = this.getBounds()

        const boundsSize = { width: boundsWidth, height: boundsHeight }

        const offsetX = this.x + boundsX
        const offsetY = this.y + boundsY

        const nextX = { x: offsetX + this.force.x, y: offsetY, ...boundsSize }
        const nextY = { x: offsetX, y: offsetY + this.force.y, ...boundsSize }

        const PX = Math.floor(this.expectedX / spriteSize)
        const PY = Math.floor(this.expectedY / spriteSize)
        const PW = Math.floor((this.expectedX + this.width) / spriteSize)
        const PH = Math.floor((this.expectedY + this.height) / spriteSize)

        const nearMatrix = []

        for (let y = PY; y <= PH; y++) {
            for (let x = PX; x <= PW; x++) {
                const data = world.tileData(x, y)
                if (data.solid) {
                    nearMatrix.push(data)
                }
            }
        }

        nearMatrix.forEach((tile) => {
            if (overlap(nextX, tile)) {
                if (this.force.x < 0) {
                    this.force.x = tile.x + tile.width - offsetX
                }
                else if (this.force.x > 0) {
                    this.force.x = tile.x - offsetX - boundsWidth
                }
            }
            if (overlap(nextY, tile)) {
                // && tile !JumpThrough
                if (this.force.y < 0) {
                    this.force.y = tile.y + tile.height - offsetY
                }
                else if (this.force.y > 0) {
                    this.force.y = tile.y - offsetY - boundsHeight
                }
            }
        })

        this.x += this.force.x
        this.y += this.force.y

        this.onCeiling = this.expectedY < this.y
        this.onFloor = this.expectedY > this.y
        this.onLeftEdge = !world.isSolid(PX, PH)
        this.onRightEdge = !world.isSolid(PW, PH)

        if (this.onFloor) {
            this.force.y *= -0.8
            this.jump = false
            this.fall = false
        }
    }

    particles (color, count) {
        const { elements } = this._game
        elements.emitParticles(count + parseInt(Math.random() * count), {
            x: this.direction === DIRECTIONS.RIGHT ? this.x + this.width : this.x,
            y: this.y,
            width: 1,
            height: 1,
            color
        })
    }
}
