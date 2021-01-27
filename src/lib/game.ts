import * as dat from 'dat.gui'
import { Entity, Input, Scene, Viewport } from 'tiled-platformer-lib'
import { ENTITIES, ENTITIES_TYPE, INPUTS, INPUT_KEYS, LAYERS } from './constants'
import { Background, Flash, Overlay, Lightmask } from './layers'
import { isProduction, getPerformance } from './helpers'

export class Game {
    public fps = 60
    public frameTime = 0
    public lastFrameTime = 0
    public lastLoop = 0
    public then = getPerformance()
    public data: any
    public gui: dat
    public images: StringTMap<HTMLImageElement>
    public viewport = new Viewport(248, 148)
    public input = new Input(INPUTS, INPUT_KEYS)
    public scene: Scene
    public player: Entity
    public overlay: any
    public animationFrame: any

    constructor (public ctx: CanvasRenderingContext2D) {
        this.init = this.init.bind(this)
        this.frame = this.frame.bind(this)
        this.restart = this.restart.bind(this)
    }

    onLoad (data: any, images: StringTMap<HTMLImageElement>): void {
        document.getElementById('preloader').style.display = 'none'
        this.data = data
        this.images = images
        this.init()
    }

    init (): void {
        this.scene = new Scene(this.images, this.viewport)

        this.scene.setProperty('gravity', 18)
        this.scene.createTmxMap(this.data, ENTITIES)
        this.scene.createCustomLayer(Background, 0)
        this.scene.createCustomLayer(Flash, 2)
        this.scene.createCustomLayer(Lightmask) 
    
        this.overlay = this.scene.createCustomLayer(Overlay)
        this.player = this.scene.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)

        this.scene.camera.moveTo(0, 0)
        this.scene.camera.setFollow(this.player, false)
        this.overlay.showHUD = true

        this.animationFrame = requestAnimationFrame(this.frame)
        !isProduction && this.debug()
    }

    restart (): void {
        cancelAnimationFrame(this.animationFrame)
        this.init()
    }

    loop (delta: number): void {
        this.scene.update(delta, this.input)
        this.scene.draw(this.ctx)
        // Respawn
        if (this.player.energy[0] <= 0) {
            this.player.visible && this.overlay.fadeOut()
            this.player.visible = false
            this.scene.startTimeout('player-respawn', 3000, this.restart)
        }
    }
    
    frame (time: number): void {
        const delta = (time - this.lastFrameTime) / 1000
        if (delta < 0.2) {
            this.loop(delta)
            this.countFPS()
        }
        this.lastFrameTime = time
        this.animationFrame = requestAnimationFrame(this.frame)
    }

    countFPS (): void {
        const now = getPerformance()
        this.frameTime += (now - this.lastLoop - this.frameTime) / 100
        this.fps = 1000 / this.frameTime
        this.lastLoop = now
    }

    onResize (): Viewport {
        this.viewport.calculateSize()
        this.scene && this.scene.resize(this.viewport)
        return this.viewport
    }
    
    debug (): void {
        if (this.gui) this.gui.destroy()
        
        this.gui = new dat.GUI()

        const player: any = this.player
        const viewport: Viewport = this.viewport
        const f1 = this.gui.addFolder('Player')
        const f2 = this.gui.addFolder('Viewport')
        const f3 = this.gui.addFolder('Overlay')
        
        this.gui.add(this, 'fps').listen()
        this.gui.add(this.scene.properties, 'gravity', 0, 10).listen()
        this.gui.add(this.scene, 'debug').listen()

        f1.add(player.energy, 0).name('Energy').min(0).max(100).listen()
        f1.add(player.ammo, 1).name('Max ammo').min(1).max(16).listen()
        f1.add(player, 'invincible')

        f2.add(viewport, 'resolutionX')
        f2.add(viewport, 'resolutionY')
        f2.add(viewport, 'scale').min(1).max(100).listen()

        f3.add(this.overlay, 'fadeIn')
        f3.add(this.overlay, 'fadeOut')
        f3.add(this.overlay, 'darkOverlay').listen()
    }
}