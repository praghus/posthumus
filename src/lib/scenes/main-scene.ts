import { GUI } from 'dat.gui'
import { Scene } from 'platfuse'

import tiledMap from '../../assets/map/map.tmx'
import CustomLayer from '../layers/background'
import Overlay from '../layers/overlay'

export default class MainScene extends Scene {
    gravity = 0.05
    flash = false
    gui = new GUI()

    async init() {
        await super.init(tiledMap)

        this.setScale(6)
        this.setTileCollisionLayer(1)
        this.addLayer(CustomLayer, -1)
        this.addLayer(Overlay)

        console.log('Main Scene initialized', this)

        // Dat GUI
        const f1 = this.gui.addFolder('Scene')
        const f2 = f1.addFolder('Layers')

        this.gui.add(this.game, 'debug').listen()
        f1.add(this, 'gravity').step(0.01).min(0.01).max(1)
        f1.add(this.camera, 'scale').step(0.1).min(1).max(10).listen()

        this.layers
            .sort((a, b) => b.renderOrder - a.renderOrder)
            .map(layer => f2.add(layer, 'visible').name(layer.name || `Layer#${layer.id}`))
    }
}
