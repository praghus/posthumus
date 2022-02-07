import { tmx } from 'tmx-map-parser'
import { Game, Scene } from 'platfuse'
import { DIRECTIONS, ENTITY_TYPES } from '../constants'
import tiledMap from '../../assets/map/map.tmx'
import Flash from '../layers/flash'
import Overlay from '../layers/overlay'
import Background from '../layers/background'
import * as Models from '../models'

export default class MainScene extends Scene {
    gravity = 0.5
    flash = false
    player?: Models.Player
    entities = {
        [ENTITY_TYPES.BAT]: Models.Bat,
        [ENTITY_TYPES.BULLET]: Models.Bullet,
        [ENTITY_TYPES.DUST]: Models.Dust,
        [ENTITY_TYPES.EMITTER]: Models.Emitter,
        [ENTITY_TYPES.ITEM]: Models.Item,
        [ENTITY_TYPES.PARTICLE]: Models.Particle,
        [ENTITY_TYPES.PLAYER]: Models.Player,
        [ENTITY_TYPES.SPIDER]: Models.Spider,
        [ENTITY_TYPES.SPIKES]: Models.Spikes,
        [ENTITY_TYPES.ZOMBIE]: Models.Zombie
    }

    async init(game: Game) {
        const { layers, tilesets, tilewidth, tileheight, width, height } = await tmx(tiledMap)

        this.setDimensions(width, height, tilewidth, tileheight)
        this.addTileset(tilesets[0], 'tileset.png')
        this.createLayers([Background, layers[0], Flash, layers[1], layers[2], layers[3], Overlay])

        this.player = this.getObjectByType(ENTITY_TYPES.PLAYER) as Models.Player
        this.camera.moveTo(0, 0)
        this.camera.setFollow(this.player, false)

        game.onKeyDown('Space', () => this.player?.shoot(game))
        game.onKeyDown('ArrowUp', () => this.player?.move(game, DIRECTIONS.UP))
        game.onKeyDown('ArrowLeft', () => this.player?.move(game, DIRECTIONS.LEFT))
        game.onKeyDown('ArrowRight', () => this.player?.move(game, DIRECTIONS.RIGHT))
        game.setAudioVolume(0.1)
        // game.loopSound('loop.mp3')
    }
}
