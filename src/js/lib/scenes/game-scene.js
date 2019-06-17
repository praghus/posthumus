import Overlay from '../models/overlay'
import tmxFile from '../../../assets/levels/map.tmx'
import { tmxParser } from 'tmx-tiledmap'
import { Game, World } from 'tiled-platformer-lib'
import {
    isMobileDevice,
    createLamp,
    createRectangleObject,
    setLightmaskElement
} from '../../lib/utils/helpers'
import {
    ASSETS,
    COLORS,
    CONFIG,
    ENTITIES,
    ENTITIES_TYPE,
    JUMP_THROUGH_TILES,
    LAYERS,
    NON_COLLIDE_TILES
} from '../../lib/constants'

const {
    DarkMask,
    Lighting
} = window.illuminated

const worldConfig = {
    gravity: 0.5,
    entities: ENTITIES,
    nonColideTiles: NON_COLLIDE_TILES,
    oneWayTiles: JUMP_THROUGH_TILES
}

export default class GameScene extends Game {
    constructor (ctx, props) {
        super(ctx, props)
        this.debug = false

        this.dynamicLights = !isMobileDevice()
        this.onLoad = this.onLoad.bind(this)
        this.addLightElement = this.addLightElement.bind(this)
        this.addLightmaskElement = this.addLightmaskElement.bind(this)
        this.renderLightingEffect = this.renderLightingEffect.bind(this)
        tmxParser(tmxFile).then(this.onLoad)
    }

    onLoad (data) {
        this.world = new World(data, worldConfig, this)
        this.overlay = new Overlay(this)

        this.player = this.world.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)

        this.world.addLayer(this.renderLightingEffect, 2)
        this.camera.setSurfaceLevel(this.world.getProperty('surfaceLevel'))
        this.camera.setFollow(this.player)
        this.camera.setMiddlePoint(
            this.props.viewport.resolutionX / 3,
            this.player.height
        )
        if (this.dynamicLights) {
            this.light = createLamp(0, 0, 130, COLORS.TRANS_WHITE)
            this.lighting = new Lighting({light: this.light, objects: []})
            this.darkmask = new DarkMask({lights: [this.light]})
            this.lightmask = []
            this.lights = []
            this.generateShadowCasters()
        }
        this.loaded = true
        this.overlay.fadeIn()
    }

    onUpdate () {
        this.debug = this.props.config[CONFIG.DEBUG_MODE]
    }

    tick () {
        this.dynamicLights && this.clearLights()
        this.world.update()
        this.camera.update()
    }

    render () {
        const { camera, player, overlay, world } = this
        this.renderBackground()
        if (camera.underground || player.underground || player.inDark > 0) {
            this.dynamicLights && this.calculateShadows()
        }
        world.draw()
        player.shootFlash = false
        overlay.displayHUD()
        overlay.update()
    }

    renderBackground () {
        const {
            ctx,
            camera,
            player,
            props: {
                assets,
                viewport: { resolutionX }
            }
        } = this

        if (!camera.underground) {
            ctx.drawImage(assets.bg1, 0, 0)
            ctx.drawImage(assets.moon, resolutionX - 70, 10)
            ctx.drawImage(assets.bg2, (camera.x / 8), -50 + (camera.y / 16))
            if (player.shootFlash && !player.underground && !player.inDark) {
                this.renderShootFlash()
            }
        }
    }

    renderLightingEffect () {
        const {
            ctx,
            assets,
            dynamicLights,
            camera: {
                x, y, follow, underground
            },
            props: {
                viewport: { resolutionX, resolutionY }
            },
            player
        } = this

        if (underground || player.underground || player.inDark > 0) {
            dynamicLights && this.calculateShadows()
            if (dynamicLights) {
                this.light.position.x = follow.x + (follow.width / 2) + x
                this.light.position.y = follow.y + (follow.height / 2) + y
                this.lighting.light = this.light
                this.lighting.objects = this.lightmask
                this.lighting.compute(resolutionX, resolutionY)
                this.darkmask.lights = [this.light].concat(this.lights)
                this.darkmask.compute(resolutionX, resolutionY)
                ctx.save()
                ctx.globalCompositeOperation = 'lighter'
                this.lighting.render(ctx)
                ctx.globalCompositeOperation = 'source-over'
                this.darkmask.render(ctx)
                ctx.restore()
            }
            else {
                ctx.drawImage(assets[ASSETS.LIGHTING],
                    -400 + (follow.x + x + follow.width / 2),
                    -400 + (follow.y + y + follow.height / 2)
                )
            }
            player.shootFlash && this.renderShootFlash()
        }
    }

    renderShootFlash () {
        const {
            ctx,
            props: {
                viewport: { resolutionX, resolutionY }
            }
        } = this

        ctx.fillStyle = COLORS.FLASH
        ctx.fillRect(0, 0, resolutionX, resolutionY)
    }

    calculateShadows () {
        const {
            camera,
            player,
            props: {
                viewport: { resolutionX, resolutionY }
            },
            world
        } = this

        const { spriteSize } = world
        const castingShadows = camera.underground || player.underground || player.inDark > 0
        const shouldCreateLightmask = this.dynamicLights && castingShadows

        let y = Math.floor(camera.y % spriteSize)
        let _y = Math.floor(-camera.y / spriteSize)

        while (y < resolutionY) {
            let x = Math.floor(camera.x % spriteSize)
            let _x = Math.floor(-camera.x / spriteSize)
            while (x < resolutionX) {
                const tile = world.getTile(_x, _y, LAYERS.MAIN)
                if (tile > 0 && shouldCreateLightmask) {
                    const maskElement = this.getShadowCaster(_x, _y) //
                    if (world.isSolidTile(tile)) {
                        this.addLightmaskElement(maskElement, {x, y})
                    }
                }
                x += spriteSize
                _x++
            }
            y += spriteSize
            _y++
        }
    }

    generateShadowCasters () {
        const {
            width,
            height,
            spriteSize
        } = this.world

        this.shadowCasters = [...Array(width).keys()].map(() => Array(height))
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.shadowCasters[x][y] = this.world.getTile(x, y, LAYERS.MAIN) > 0
                    ? createRectangleObject(x, y, spriteSize, spriteSize)
                    : null
            }
        }
    }

    addShadowCaster (x, y) {
        const { spriteSize } = this.world
        this.shadowCasters[x][y] = createRectangleObject(x, y, spriteSize, spriteSize)
    }

    getShadowCaster (x, y) {
        return this.world.inRange(x, y) && this.shadowCasters[x][y]
    }

    clearLights () {
        this.lightmask.map((v, k) => {
            this.lightmask[k] = null
        })
        this.lights.map((v, k) => {
            this.lights[k] = null
        })
        this.lightmask.splice(0, this.lightmask.length)
        this.lights.splice(0, this.lights.length)
    }

    addLightmaskElement (maskElement, {x, y, width, height}) {
        const { spriteSize } = this.world
        this.lightmask.push(setLightmaskElement(maskElement, {
            x, y, width: width || spriteSize, height: height || spriteSize
        }))
    }

    addLightElement (x, y, distance, color) {
        this.lights.push(createLamp(x, y, distance, color))
    }

    addTile (x, y, tile, layer) {
        this.world.putTile(x, y, tile, layer)
        if (this.world.isSolidTile(tile) && layer === LAYERS.MAIN) {
            this.addShadowCaster(x, y)
        }
    }
}
