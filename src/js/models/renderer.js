import '../lib/illuminated'

export default class Renderer {
    constructor (game) {
        const { Lamp, Vec2 } = window.illuminated
        this._game = game
        this.dynamicLights = true
        this.lightmask = []
        this.playerLight = new Lamp({
            position: new Vec2(0, 0),
            color: 'rgba(255,200,100,0.5)',
            distance: 100,
            samples: 1,
            radius: 1
        })
    }

    draw () {
        const { ctx, camera, player, viewport, ticker } = this._game
        const { resolutionX, resolutionY, scale } = viewport

        // disable image smoothing
        ctx.imageSmoothingEnabled = false

        ctx.save()
        ctx.scale(scale, scale)
        ctx.clearRect(0, 0, resolutionX, resolutionY)

        this.renderBackground()
        this.renderGround()
        this.renterObjects()
        this.renderForeGround()
        if (this.dynamicLights && (camera.underground || player.inDark > 0)) {
            this.renderLightingEffect()
        }
        this.renderDarks()
        this.renderPlayer()
        this.fontPrint(`${Math.round(ticker.fps)} FPS`, 5, 5)
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

        this.playerLight.position = new Vec2(
            player.x + (player.width / 2) + camera.x,
            player.y + (player.height / 2) + camera.y
        )
        const lighting = new Lighting({light: this.playerLight, objects: this.lightmask})
        const darkmask = new DarkMask({lights: [this.playerLight]})
        lighting.compute(resolutionX, resolutionY)
        darkmask.compute(resolutionX, resolutionY)
        ctx.save()
        ctx.globalCompositeOperation = 'overlay' // destination-in, overlay, soft-light
        lighting.render(ctx)
        ctx.globalCompositeOperation = 'source-over'
        darkmask.render(ctx)
        ctx.restore()
    }

    renderBackground () {
        const { ctx, camera, assets, viewport } = this._game
        const { resolutionX } = viewport

        if (!camera.underground) {
            ctx.drawImage(assets.bg1, 0, 0)
            ctx.drawImage(assets.moon, resolutionX - 100, 16)
            ctx.drawImage(assets.bg2, (camera.x / 8), -32 + (camera.y / 16))
        }
    }

    renderGround () {
        const { ctx, world, camera, assets, viewport } = this._game
        const { resolutionX, resolutionY } = viewport
        const { spriteCols, spriteSize } = world
        const { Vec2, RectangleObject } = window.illuminated

        let y = Math.floor(camera.y % spriteSize)
        let _y = Math.floor(-camera.y / spriteSize)

        this.lightmask = []

        while (y < resolutionY) {
            let x = Math.floor(camera.x % spriteSize)
            let _x = Math.floor(-camera.x / spriteSize)
            while (x < resolutionX) {
                const tile = world.get('ground', _x, _y)
                const back = world.get('back', _x, _y)
                if (tile > 1 || back > 1) {
                    // illuminated.js light mask
                    if (tile > 224 && this.dynamicLights) {
                        this.lightmask.push(new RectangleObject({
                            topleft: new Vec2(x, y),
                            bottomright: new Vec2(x + spriteSize, y + spriteSize)
                        }))
                    }
                    if (back > 1) {
                        ctx.drawImage(assets.tiles,
                            (((back - 1) % spriteCols)) * spriteSize,
                            (Math.ceil(back / spriteCols) - 1) * spriteSize,
                            spriteSize, spriteSize, x, y,
                            spriteSize, spriteSize)
                    }
                    if (tile > 1) {
                        ctx.drawImage(assets.tiles,
                            (((tile - 1) % spriteCols)) * spriteSize,
                            (Math.ceil(tile / spriteCols) - 1) * spriteSize,
                            spriteSize, spriteSize, x, y,
                            spriteSize, spriteSize)
                    }
                    // calculate shadow
                    if (back > 1 && tile < 224) {
                        let shadow = 0
                        if (_x > 0 && _y > 0 &&
                          world.isShadowCaster(_x - 1, _y) &&
                          world.isShadowCaster(_x - 1, _y - 1) &&
                          world.isShadowCaster(_x, _y - 1)) {
                            shadow = 6
                        }
                        else if (_x > 0 && _y > 0 &&
                          world.isShadowCaster(_x - 1, _y - 1) &&
                          world.isShadowCaster(_x, _y - 1)) {
                            shadow = 5
                        }
                        else if (_x > 0 && _y > 0 &&
                          world.isShadowCaster(_x - 1, _y) &&
                          world.isShadowCaster(_x - 1, _y - 1)) {
                            shadow = 4
                        }
                        else if (_x > 0 &&
                          world.isShadowCaster(_x - 1, _y)) {
                            shadow = 1
                        }
                        else if (_y > 0 &&
                          world.isShadowCaster(_x, _y - 1)) {
                            shadow = 2
                        }
                        else if (_x > 0 && _y > 0 &&
                            world.isShadowCaster(_x - 1, _y - 1)) {
                            shadow = 3
                        }
                        if (shadow > 0) {
                            ctx.drawImage(assets.shadows, (shadow - 1) * spriteSize, 0,
                                spriteSize, spriteSize, x, y,
                                spriteSize, spriteSize)
                        }
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

    renterObjects () {
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
}
