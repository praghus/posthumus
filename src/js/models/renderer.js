import '../lib/illuminated'
import { COLORS } from '../lib/utils'

export default class Renderer {
    constructor (game) {
        const { Lamp, Vec2 } = window.illuminated
        this._game = game
        this.dynamicLights = true
        this.lightmask = []
        this.playerLight = new Lamp({
            position: new Vec2(0, 0),
            color: COLORS.PLAYER_LIGHT,
            distance: 300,
            samples: 1,
            radius: 1
        })
        this.playerShootLight = new Lamp({
            position: new Vec2(0, 0),
            color: COLORS.PLAYER_SHOOT,
            distance: 500,
            samples: 1,
            radius: 1
        })
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
            this.renderObjects()
            this.renderPlayer()
            this.renderForeGround()
        }
        else {
            this.renderObjects()
            this.renderPlayer()
            this.renderForeGround()
            this.renderDarks()
        }
        // this.fontPrint(`${Math.round(ticker.fps)} FPS`, 5, 5)
        this.renderIndicators()
        // restore player shoot flash flag
        player.shootFlash = false

        ctx.restore()
    }

    fontPrint (text, x = -1, y = -1) {
        const { ctx, assets, viewport } = this._game
        const { resolutionX, resolutionY } = viewport

        x = x === -1 ? (resolutionX - text.length * 8) / 2 : x
        y = y === -1 ? (resolutionY - 8) / 2 : y

        for (let i = 0; i < text.length; i++) {
            const chr = text.charCodeAt(i)
            ctx.drawImage(assets.font,
                ((chr) % 16) * 16, Math.ceil(((chr + 1) / 16) - 1) * 16,
                16, 16, x + (i * 8), y, 8, 8
            )
        }
    }

    /**
     * illuminated.js
     */
    renderLightingEffect () {
        const { ctx, camera, player, viewport } = this._game
        const { resolutionX, resolutionY } = viewport
        const { DarkMask, Lighting, Vec2 } = window.illuminated

        const light = player.shootFlash
            ? this.playerShootLight
            : this.playerLight

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
            ctx.drawImage(assets.moon, resolutionX - 100, 16)
            ctx.drawImage(assets.bg2, (camera.x / 8), -62 + (camera.y / 16))
        }
    }

    renderGround () {
        const { ctx, world, camera, assets, viewport, player } = this._game
        const { resolutionX, resolutionY } = viewport
        const { spriteCols, spriteSize } = world
        const { Vec2, RectangleObject } = window.illuminated

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
                        this.lightmask.push(new RectangleObject({
                            topleft: new Vec2(x, y),
                            bottomright: new Vec2(x + spriteSize, y + spriteSize)
                        }))
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
                    // calculate shadow
                    // if (back > 1 && tile < 224) {
                    //     let shadow = 0
                    //     if (_x > 0 && _y > 0 &&
                    //   world.isShadowCaster(_x - 1, _y) &&
                    //   world.isShadowCaster(_x - 1, _y - 1) &&
                    //   world.isShadowCaster(_x, _y - 1)) {
                    //         shadow = 6
                    //     }
                    //     else if (_x > 0 && _y > 0 &&
                    //   world.isShadowCaster(_x - 1, _y - 1) &&
                    //   world.isShadowCaster(_x, _y - 1)) {
                    //         shadow = 5
                    //     }
                    //     else if (_x > 0 && _y > 0 &&
                    //   world.isShadowCaster(_x - 1, _y) &&
                    //   world.isShadowCaster(_x - 1, _y - 1)) {
                    //         shadow = 4
                    //     }
                    //     else if (_x > 0 &&
                    //   world.isShadowCaster(_x - 1, _y)) {
                    //         shadow = 1
                    //     }
                    //     else if (_y > 0 &&
                    //   world.isShadowCaster(_x, _y - 1)) {
                    //         shadow = 2
                    //     }
                    //     else if (_x > 0 && _y > 0 &&
                    //     world.isShadowCaster(_x - 1, _y - 1)) {
                    //         shadow = 3
                    //     }
                    //     if (shadow > 0) {
                    //         ctx.drawImage(assets.shadows, (shadow - 1) * spriteSize, 0,
                    //             spriteSize, spriteSize, x, y,
                    //             spriteSize, spriteSize)
                    //     }
                    // }
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
        const { ctx, assets, player, viewport } = this._game
        const { resolutionY } = viewport

        ctx.drawImage(assets.live, 0, 10, player.maxEnergy * 11, 10, 5, 5, player.maxEnergy * 11, 10)

        if (player.energy > 0) {
            ctx.drawImage(assets.live, 0, 0, player.energy * 11, 10, 5, 5, player.energy * 11, 10)
        }

        for (let i = 0; i < player.maxAmmo; i++) {
            ctx.drawImage(assets.shell, 7, 0, 7, 16, 4 + (i * 6), resolutionY - 18, 7, 16)
        }
        for (let i = 0; i < player.ammo; i++) {
            ctx.drawImage(assets.shell, 0, 0, 7, 16, 4 + (i * 6), resolutionY - 18, 7, 16)
        }
    }
}
