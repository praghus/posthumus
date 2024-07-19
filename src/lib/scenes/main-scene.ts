import { GUI } from 'dat.gui'
import { Scene } from 'platfuse'

import tiledMap from '../../assets/map/map.tmx'
import Background from '../layers/background'
import Overlay from '../layers/overlay'
import { ObjectTypes } from '../constants'
import Player from '../models/player'

export default class MainScene extends Scene {
    gravity = 0.05
    tmxMap = tiledMap
    overlay?: Overlay
    gui?: GUI

    init() {
        this.setScale(6)
        this.setTileCollisionLayer(1)
        this.addLayer(Background, -1)
        this.overlay = this.addLayer(Overlay) as Overlay

        const player = this.getObjectByType(ObjectTypes.Player) as Player

        this.camera.setSpeed(0.06)
        this.camera.follow(player)
        this.initGUI()
        console.log('Main Scene initialized', this)
    }

    initGUI() {
        if (this.gui instanceof GUI || !this.game.debug) return

        this.gui = new GUI()

        const f1 = this.gui.addFolder('Scene')
        const f2 = f1.addFolder('Layers')
        f1.add(this, 'gravity').step(0.01).min(0.01).max(1)
        f1.add(this.camera, 'scale').step(0.1).min(1).max(10).listen()
        this.layers
            .sort((a, b) => b.renderOrder - a.renderOrder)
            .map(layer => f2.add(layer, 'visible').name(`${layer.name}`).listen())
    }

    postUpdate(): void {
        if (this.game.input.keyWasPressed('KeyP')) {
            console.info('Pause')
            this.game.togglePause()
        }
    }

    fadeIn() {
        this.overlay?.fadeIn()
    }

    fadeOut() {
        this.overlay?.fadeOut()
    }
}
