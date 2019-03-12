import { ASSETS, COLORS, FONTS } from '../constants'

export default class Overlay {
    constructor (scene) {
        this._scene = scene
        this.blackOverlay = 0
        this.hints = []
        this.fade = {
            in: false,
            out: false
        }
        this.addHint = ({x, y, width, hint}) => {
            this.hints.push({x, y, width, hint})
        }
        this.fadeIn = () => {
            if (!this.fade.in) {
                this.blackOverlay = 1
                this.fade.in = true
                this.fade.out = false
            }
        }
        this.fadeOut = () => {
            if (!this.fade.out) {
                this.blackOverlay = 0
                this.fade.in = false
                this.fade.out = true
            }
        }
    }

    update () {
        if (this.hints.length) {
            this.hints.map((element, index) => {
                this.displayHint(element)
                this.hints.splice(index, 1)
            })
        }
        if (this.blackOverlay > 0) {
            const { ctx, viewport } = this._scene
            const { resolutionX, resolutionY } = viewport

            ctx.globalAlpha = this.blackOverlay
            ctx.fillStyle = COLORS.BLACK
            ctx.fillRect(0, 0, resolutionX, resolutionY)
        }
        if (this.fade.in) {
            this.blackOverlay -= 0.01
            if (this.blackOverlay < 0) {
                this.blackOverlay = 0
                this.fade.in = false
            }
        }
        if (this.fade.out) {
            this.blackOverlay += 0.01
            if (this.blackOverlay > 1) {
                this.blackOverlay = 1
                this.fade.out = false
            }
        }
    }

    displayHUD () {
        const { ctx, camera, assets, debug, fps, player, viewport, countTime } = this._scene
        const { resolutionX, resolutionY } = viewport
        const { energy, items, lives } = player
        const fpsIndicator = `FPS:${Math.round(fps)}`
        const time = countTime()
        this.displayText(time, resolutionX - (3 + time.length * 5), 3)

        // FPS meter
        debug && this.displayText(fpsIndicator, resolutionX - (3 + fpsIndicator.length * 5), 9)

        // Camera position in debug mode
        debug && this.displayText(`CAMERA\nx:${Math.floor(camera.x)}\ny:${Math.floor(camera.y)}`, 4, 28)

        // lives and energy
        const indicatorWidth = energy && Math.round(energy / 2) || 1
        ctx.drawImage(assets[ASSETS.HEAD], 2, 1)
        ctx.drawImage(assets[ASSETS.ENERGY], 0, 5, 50, 5, -25 + resolutionX / 2, 3, 50, 5)
        ctx.drawImage(assets[ASSETS.ENERGY], 0, 0, indicatorWidth, 5, -25 + resolutionX / 2, 3, indicatorWidth, 5)
        this.displayText(`${lives}`, 12, 3)

        // buttons
        // ctx.drawImage(assets[ASSETS.BUTTONS], 0, 0, 18, 18, 6, resolutionY - 20, 18, 18)
        // ctx.drawImage(assets[ASSETS.BUTTONS], 19, 0, 18, 18, 30, resolutionY - 20, 18, 18)
        // ctx.drawImage(assets[ASSETS.BUTTONS], 57, 0, 18, 18, resolutionX - 22, resolutionY - 20, 18, 18)
        // ctx.drawImage(assets[ASSETS.BUTTONS], 38, 0, 18, 18, resolutionX - 44, resolutionY - 20, 18, 18)

        // items
        const align = 3 // -19 + resolutionX / 2
        ctx.drawImage(assets[ASSETS.FRAMES], align, resolutionY - 20)
        items.map((item, index) => {
            if (item) {
                // this.displayText(item.name, 44, (resolutionY - 18) + index * 9)
                // const {columns, name, firstgid} = world.getAssetForTile(item.gid)
                // ctx.drawImage(assets[name],
                //     ((item.gid - firstgid) % columns) * world.spriteSize,
                //     (Math.ceil(((item.gid - firstgid) + 1) / columns) - 1) * world.spriteSize,
                //     world.spriteSize, world.spriteSize,
                //     align + 1 + (index * 20), resolutionY - 19,
                //     world.spriteSize, world.spriteSize)

                ctx.drawImage(
                    assets[ASSETS.ITEMS],
                    item.animation.x, item.animation.y,
                    item.width, item.height,
                    align + 1 + (index * 20), resolutionY - 19,
                    item.width, item.height
                )
            }
        })
    }

    displayHint ({x, y, width, hint}) {
        const { ctx, assets, camera } = this._scene
        ctx.drawImage(assets[ASSETS.BUBBLE],
            Math.floor(x + camera.x + width / 2),
            Math.floor(y + camera.y) - 20
        )
        ctx.drawImage(assets[ASSETS.ITEMS],
            hint.x, hint.y,
            hint.w, hint.h,
            Math.floor(x + camera.x + width / 2) + 8,
            Math.floor(y + camera.y) - 18,
            hint.w, hint.h
        )
    }

    displayMap () {
        const { ctx, assets, player, viewport } = this._scene
        const { resolutionX, resolutionY } = viewport
        ctx.save()
        ctx.globalAlpha = 0.5
        ctx.fillStyle = COLORS.BLACK
        ctx.fillRect(0, 0, resolutionX, resolutionY)
        ctx.restore()
        player.mapPieces.map((piece) => {
            ctx.drawImage(assets[ASSETS.MAP_PIECE],
                piece.x, piece.y,
                piece.w, piece.h,
                Math.floor((resolutionX / 2) + (piece.x * 2) - 48),
                Math.floor((resolutionY / 2) + (piece.y * 2) - 32),
                piece.w * 2, piece.h * 2
            )
        })
        this.displayText('COLLECTED MAP PIECES',
            (resolutionX / 2) - 49,
            (resolutionY / 2) - 42,
        )
    }

    displayText (text, x, y, font = FONTS.FONT_SMALL) {
        const { assets, ctx } = this._scene
        text.split('\n').reverse().map((output, index) => {
            for (let i = 0; i < output.length; i++) {
                const chr = output.charCodeAt(i)
                ctx.drawImage(assets[font.name],
                    ((chr) % 16) * font.size, Math.ceil(((chr + 1) / 16) - 1) * font.size,
                    font.size, font.size,
                    Math.floor(x + (i * font.size)), Math.floor(y - (index * (font.size + 1))),
                    font.size, font.size
                )
            }
        })
    }

    displayDebug (entity) {
        const { ctx, camera } = this._scene
        const { bounds, width, height, name, type, visible, force } = entity
        const [ posX, posY ] = [
            Math.floor(entity.x + camera.x),
            Math.floor(entity.y + camera.y)
        ]
        if (entity.points) {
            ctx.save()
            ctx.strokeStyle = COLORS.LIGHT_RED
            ctx.beginPath()
            ctx.moveTo(
                entity.points[0][0] + posX,
                entity.points[0][1] + posY
            )
            entity.points.map(([x, y]) => {
                ctx.lineTo(
                    posX + x,
                    posY + y
                )
                // this.displayText(`${entity.x + x},${entity.x + y}`, posX + x, posY + y)
            })
            ctx.lineTo(
                entity.points[0][0] + posX,
                entity.points[0][1] + posY
            )
            ctx.stroke()
            ctx.restore()

            // if (entity.triangle.length > 0) {
            //     ctx.save()
            //     ctx.strokeStyle = COLORS.GREEN
            //     ctx.beginPath()
            //     ctx.moveTo(
            //         entity.triangle[0][0] + camera.x,
            //         entity.triangle[0][1] + camera.Y
            //     )
            //     entity.triangle.map(([x, y]) => {
            //         ctx.lineTo(
            //             x + camera.x,
            //             y + camera.y
            //         )
            //     })
            //     ctx.lineTo(
            //         entity.triangle[0][0] + camera.x,
            //         entity.triangle[0][1] + camera.y
            //     )
            //     ctx.stroke()
            //     ctx.restore()
            // }

            // if (bounds) {
            //     this.outline(
            //         posX + bounds.x,
            //         posY + bounds.y,
            //         bounds.width,
            //         bounds.height,
            //         COLORS.SPIDER_WEB
            //     )
            // }
        }
        else {
            this.outline(
                posX, posY, width, height,
                visible ? COLORS.GREEN : COLORS.PURPLE
            )
            if (bounds) {
                this.outline(
                    posX + bounds.x,
                    posY + bounds.y,
                    bounds.width,
                    bounds.height,
                    COLORS.LIGHT_RED
                )
            }
        }
        if (visible) {
            this.displayText(`${name || type}\nx:${Math.floor(entity.x)}\ny:${Math.floor(entity.y)}`,
                posX,
                posY - 8,
            )
        }
        // else {
        //     this.displayText(`${String.fromCharCode(26)}`,
        //         posX,
        //         posY,
        //     )
        // }
        // ${String.fromCharCode(26)}
        if (force.x !== 0) {
            const forceX = `${force.x.toFixed(2)}`
            this.displayText(forceX,
                force.x > 0 ? posX + width + 1 : posX - (forceX.length * 5) - 1,
                posY + height / 2,
            )
        }
        if (force.y !== 0) {
            const forceY = `${force.y.toFixed(2)}`
            this.displayText(forceY,
                posX + (width - (forceY.length * 5)) / 2,
                posY + height / 2
            )
        }
    }

    outline (x, y, width, height, color) {
        const { ctx } = this._scene
        ctx.save()
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + width, y)
        ctx.lineTo(x + width, y + height)
        ctx.lineTo(x, y + height)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.restore()
    }
}
