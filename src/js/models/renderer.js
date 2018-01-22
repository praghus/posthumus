import '../lib/illuminated'
import { COLORS, FONTS, LIGHTS } from '../lib/constants'

const { DarkMask, Lighting, Vec2, RectangleObject } = window.illuminated

export default class Renderer {
    constructor (game) {
        this._game = game
        this.frame = 0
        this.fps = 0
        this.then = performance.now()
        this.dynamicLights = true
        this.lightmask = []
    }

    draw () {
        const { ctx, camera, player, viewport } = this._game
        const { resolutionX, resolutionY, scale } = viewport

        // disable image smoothing
        ctx.imageSmoothingEnabled = false

        ctx.save()
        ctx.scale(scale, scale)
        ctx.clearRect(0, 0, resolutionX, resolutionY)

        this.renderBackground()
        this.renderGround()

        if (this.dynamicLights && (camera.underground || player.inDark > 0)) {
            this.renderLightingEffect()
            this.renderDarks()
            this.renderPlayer()
            this.renderObjects()
            this.renderForeGround()
        }
        else {
            this.renderPlayer()
            this.renderObjects()
            this.renderForeGround()
            this.renderDarks()
        }
        this.renderIndicators()
        // restore player shoot flash flag
        player.shootFlash = false
        ctx.restore()
    }

    fontPrint (text, x = -1, y = -1, font = FONTS.FONT_NORMALL) {
        const { ctx, assets, viewport } = this._game
        const { resolutionX, resolutionY } = viewport

        x = x === -1 ? (resolutionX - text.length * font.size) / 2 : x
        y = y === -1 ? (resolutionY - font.size) / 2 : y

        for (let i = 0; i < text.length; i++) {
            const chr = text.charCodeAt(i)
            ctx.drawImage(assets[font.name],
                ((chr) % 16) * font.size, Math.ceil(((chr + 1) / 16) - 1) * font.size,
                font.size, font.size, x + (i * font.size), y, font.size, font.size
            )
        }
    }

    /**
     * illuminated.js
     */
    addLightmaskElement (x, y, width, height) {
        this.lightmask.push(new RectangleObject({
            topleft: new Vec2(x, y),
            bottomright: new Vec2(x + width, y + height)
        }))
    }

    renderLightingEffect () {
        const { ctx, camera, elements, player, viewport } = this._game
        const { resolutionX, resolutionY } = viewport

        const light = elements.getLight(player.shootFlash
            ? LIGHTS.SHOOT_LIGHT
            : LIGHTS.PLAYER_LIGHT
        )

        light.position = new Vec2(
            player.x + (player.width / 2) + camera.x,
            player.y + (player.height / 2) + camera.y
        )

        const lighting = new Lighting({light: light, objects: this.lightmask})
        const darkmask = new DarkMask({lights: [light]})

        lighting.compute(resolutionX, resolutionY)
        darkmask.compute(resolutionX, resolutionY)

        ctx.save()

        // destination-in, overlay, soft-light
        ctx.globalCompositeOperation = 'hard-light' // camera.underground ? 'destination-in' : 'overlay'
        lighting.render(ctx)

        ctx.globalCompositeOperation = 'source-overlay'
        darkmask.render(ctx)

        ctx.restore()
    }

    renderBackground () {
        const { ctx, camera, assets, viewport } = this._game
        const { resolutionX } = viewport

        if (!camera.underground) {
            ctx.drawImage(assets.bg1, 0, 0)
            ctx.drawImage(assets.moon, resolutionX - 80, 16)
            ctx.drawImage(assets.bg2, (camera.x / 8), -50 + (camera.y / 16))
        }
    }

    renderGround () {
        const { ctx, world, camera, assets, viewport, player } = this._game
        const { resolutionX, resolutionY } = viewport
        const { spriteCols, spriteSize } = world

        let y = Math.floor(camera.y % spriteSize)
        let _y = Math.floor(-camera.y / spriteSize)

        this.lightmask = []

        if (player.shootFlash && !camera.underground && !player.inDark) {
            ctx.fillStyle = COLORS.PLAYER_SHOOT
            ctx.fillRect(0, 0, resolutionX, resolutionY)
        }

        while (y < resolutionY) {
            let x = Math.floor(camera.x % spriteSize)
            let _x = Math.floor(-camera.x / spriteSize)
            while (x < resolutionX) {
                const tile = world.get('ground', _x, _y)
                const back = world.get('back', _x, _y)
                if (tile > 0 || back > 0) {
                    // illuminated.js light mask
                    if (tile && this.dynamicLights) {
                        this.addLightmaskElement(x, y, spriteSize, spriteSize)
                    }
                    if (back > 0) {
                        ctx.drawImage(assets.tiles,
                            (((back - 1) % spriteCols)) * spriteSize,
                            (Math.ceil(back / spriteCols) - 1) * spriteSize,
                            spriteSize, spriteSize, x, y,
                            spriteSize, spriteSize)
                    }
                    if (tile > 0) {
                        ctx.drawImage(assets.tiles,
                            (((tile - 1) % spriteCols)) * spriteSize,
                            (Math.ceil(tile / spriteCols) - 1) * spriteSize,
                            spriteSize, spriteSize, x, y,
                            spriteSize, spriteSize)
                    }
                }
                x += spriteSize
                _x++
            }
            y += spriteSize
            _y++
        }
    }

    renderPlayer () {
        const { ctx, player } = this._game
        player.draw(ctx)
    }

    renderObjects () {
        const { ctx, elements } = this._game
        const { objects } = elements
        objects.forEach((elem) => {
            elem.draw(ctx)
        })
    }

    renderForeGround () {
        const { ctx, world, camera, assets, viewport, player } = this._game
        const { resolutionX, resolutionY } = viewport
        const { spriteCols, spriteSize } = world

        let y = Math.floor(camera.y % spriteSize)
        let _y = Math.floor(-camera.y / spriteSize)
        while (y < resolutionY) {
            let x = Math.floor(camera.x % spriteSize)
            let _x = Math.floor(-camera.x / spriteSize)
            if (_x < 0) _x = 0
            if (_y < 0) _y = 0
            while (x < resolutionX) {
                const tile = world.get('fore', _x, _y)
                const dark = world.get('mask', _x, _y)
                if (tile > 0) {
                    ctx.drawImage(assets.tiles,
                        (((tile - 1) % spriteCols)) * spriteSize,
                        (Math.ceil(tile / spriteCols) - 1) * spriteSize,
                        spriteSize, spriteSize, x, y,
                        spriteSize, spriteSize)
                }
                if (dark === 0 && player.inDark > 0) {
                    ctx.fillStyle = 'rbg(20,12,28)'
                    ctx.fillRect(x, y, spriteSize, spriteSize)
                }
                x += spriteSize
                _x++
            }
            y += spriteSize
            _y++
        }
    }

    renderDarks () {
        const { ctx, elements } = this._game
        const { darks } = elements
        darks.forEach((elem) => {
            elem.draw(ctx)
        })
    }

    renderIndicators () {
        const { ctx, assets, fps, player, viewport } = this._game
        const { resolutionX, resolutionY } = viewport
        const fpsIndicator = `FPS:${Math.round(fps)}`

        // FPS meter
        this.fontPrint(fpsIndicator, resolutionX - (5 + fpsIndicator.length * 5), resolutionY - 10, FONTS.FONT_SMALL)

        // energy
        ctx.drawImage(assets.live, 0, 10, player.maxEnergy * 11, 10, 5, 5, player.maxEnergy * 11, 10)
        if (player.energy > 0) {
            ctx.drawImage(assets.live, 0, 0, player.energy * 11, 10, 5, 5, player.energy * 11, 10)
        }

        // ammo
        for (let i = 0; i < player.maxAmmo; i++) {
            ctx.drawImage(assets.shell, i < player.ammo ? 0 : 6, 0, 6, 14, 4 + (i * 5), resolutionY - 18, 6, 14)
        }
    }
}
