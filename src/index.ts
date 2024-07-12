import { Game } from 'platfuse'

import { ObjectTypes } from './lib/constants'
import MainScene from './lib/scenes/main-scene'
import assetsToPreload from './lib/assets'
import Player from './lib/models/player'
import Zombie from './lib/models/zombie'
import Box from './lib/models/box'
import Bat from './lib/models/bat'
import Item from './lib/models/item'

import './style.css'

const config = {
    debug: true,
    pixelPerfect: true,
    entities: {
        [ObjectTypes.Bat]: Bat,
        [ObjectTypes.Box]: Box,
        [ObjectTypes.Item]: Item,
        [ObjectTypes.Player]: Player,
        [ObjectTypes.Zombie]: Zombie
    },
    scenes: {
        MainScene
    }
}

const game = new Game(config, assetsToPreload)

async function start() {
    await game.start('MainScene')
    game.setAudioVolume(0.1)
}

start()
