import { Game } from 'platfuse'

import MainScene from './lib/scenes/main-scene'
import assetsToPreload from './lib/assets'
import Player from './lib/models/player'
import { ObjectTypes } from './lib/constants'
import Zombie from './lib/models/zombie'
import Box from './lib/models/box'

import './style.css'
import Bat from './lib/models/bat'

const config = {
    // fixedSize: vec2(1280, 720),
    debug: false,
    global: true,
    entities: {
        [ObjectTypes.Bat]: Bat,
        [ObjectTypes.Box]: Box,
        [ObjectTypes.Player]: Player,
        [ObjectTypes.Zombie]: Zombie
    }
}

const game = new Game(config, assetsToPreload)

async function start() {
    await game.init(MainScene)
    game.setAudioVolume(0.1)
}

start()
