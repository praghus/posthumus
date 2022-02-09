import { tmx } from 'tmx-map-parser'
import { Scene } from 'platfuse'
import { DIRECTIONS, ENTITY_TYPES } from '../constants'
import tiledMap from '../../assets/map/map.tmx'
import Flash from '../layers/flash'
import Overlay from '../layers/overlay'
import Background from '../layers/background'
import Player from '../models/player'

export default class MainScene extends Scene {
    gravity = 0.5
    flash = false
    player?: Player

    async init() {
        const { game } = this
        const { layers, tilesets, tilewidth, tileheight, width, height } = await tmx(tiledMap)

        this.setDimensions(width, height, tilewidth, tileheight)
        this.addTileset(tilesets[0], 'tileset.png')
        this.createLayers([Background, layers[0], Flash, layers[1], layers[2], layers[3], Overlay])

        this.player = this.getObjectByType(ENTITY_TYPES.PLAYER) as Player
        this.camera.setOffset(0, -10)
        this.camera.moveTo(0, 0)
        this.camera.setFollow(this.player, false)

        game.onKeyDown('Space', () => this.player?.shoot())
        game.onKeyDown('ArrowUp', () => this.player?.move(DIRECTIONS.UP))
        game.onKeyDown('ArrowLeft', () => this.player?.move(DIRECTIONS.LEFT))
        game.onKeyDown('ArrowRight', () => this.player?.move(DIRECTIONS.RIGHT))
        game.setAudioVolume(0.1)
    }
}
