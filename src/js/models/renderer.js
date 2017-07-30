export default class Renderer {
    constructor (game) {
        this._game = game
    }

    draw () {
        const { ctx, viewport } = this._game
        const { resolutionX, resolutionY, scale } = viewport

        // disable image smoothing
        ctx.imageSmoothingEnabled = false

        ctx.save()
        ctx.scale(scale, scale)
        ctx.clearRect(0, 0, resolutionX, resolutionY)

        this.renderBackground()
        this.renderGround()
        this.renderPlayer()
        this.renterElements()
        this.renderForeGround()

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

        let y = Math.floor(camera.y % spriteSize)
        let _y = Math.floor(-camera.y / spriteSize)

        while (y < resolutionY) {
            let x = Math.floor(camera.x % spriteSize)
            let _x = Math.floor(-camera.x / spriteSize)
            while (x < resolutionX) {
                const tile = world.get('ground', _x, _y)
                const back = world.get('back', _x, _y)
                if (tile > 1 || back > 1) {
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

    renterElements () {
        const { ctx, elements } = this._game
        const { all } = elements
        all.forEach((elem) => {
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
}
