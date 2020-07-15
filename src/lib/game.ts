import * as dat from 'dat.gui'
import { StringTMap } from 'posthumous'
import { Input, Scene, Viewport } from 'tiled-platformer-lib'
import { ENTITIES, ENTITIES_TYPE, INPUTS, INPUT_KEYS, LAYERS } from './constants'
import { Background, Flash, Overlay, Lightmask } from './layers'
import { isProduction, getPerformance } from './helpers'

export class Game {
    public fps = 60
    public frameTime = 0
    public lastFrameTime = 0
    public lastLoop = 0
    public then = getPerformance()
    public viewport = new Viewport(248, 160)
    public input = new Input(INPUTS, INPUT_KEYS)
    public scene: TPL.Scene
    public player: TPL.Entity

    public zombiesCount = 0

    constructor (public ctx: CanvasRenderingContext2D) {
        this.frame = this.frame.bind(this)
    }

    init (data: any, images: StringTMap<HTMLImageElement>) {
        this.scene = new Scene(images, this.viewport) 
        this.scene.addTmxMap(data, ENTITIES)
        this.scene.createCustomLayer(Background, 0)
        this.scene.createCustomLayer(Flash, 2)
        this.scene.createCustomLayer(Lightmask)
        this.scene.createCustomLayer(Overlay)
        this.scene.setProperty('gravity', 0.7)
        this.player = this.scene.getObjectByType(ENTITIES_TYPE.PLAYER, LAYERS.OBJECTS)
        this.scene.focus(this.player)
        //this.scene.setProperty('inDark', true)
        !isProduction && this.debug()
        requestAnimationFrame(this.frame)
    }

    loop (delta: number)  {
        this.scene.update(delta, this.input)
        this.scene.draw(this.ctx)    
    }
    
    frame (time: number) {
        const delta = (time - this.lastFrameTime) / 1000
        if (delta < 0.2) {
            this.loop(delta)
            this.countFPS()
        }
        this.lastFrameTime = time
        requestAnimationFrame(this.frame)
    }

    countFPS () {
        const now = getPerformance()
        this.frameTime += (now - this.lastLoop - this.frameTime) / 100
        this.fps = 1000 / this.frameTime
        this.lastLoop = now
    }

    onResize () {
        this.viewport.calculateSize()
        this.scene && this.scene.resize(this.viewport)
    }

    debug () {
        const gui = new dat.GUI()
        const player: any = this.player
        gui.add(this, 'fps').listen()
        gui.add(this.scene.properties, 'gravity', 0, 1).listen()
        gui.add(this.scene, 'debug').listen()
        
        const f1 = gui.addFolder('Player')
        f1.add(player.energy, 0).name('Energy').min(0).max(100).listen()
        f1.add(player.ammo, 1).name('Max ammo').min(1).max(16).listen()
    }
}