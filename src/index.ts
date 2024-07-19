import { Game } from 'platfuse'
import { ObjectTypes } from './lib/constants'
import AssetsToPreload from './lib/assets'
import IntroScene from './lib/scenes/intro-scene'
import MainScene from './lib/scenes/main-scene'
import Bat from './lib/models/bat'
import Box from './lib/models/box'
import Item from './lib/models/item'
import Player from './lib/models/player'
import Spikes from './lib/models/spikes'
import Zombie from './lib/models/zombie'

import './style.css'

const config = {
    // debug: true,
    pixelPerfect: true,
    entities: {
        [ObjectTypes.Bat]: Bat,
        [ObjectTypes.Box]: Box,
        [ObjectTypes.Item]: Item,
        [ObjectTypes.Player]: Player,
        [ObjectTypes.Spikes]: Spikes,
        [ObjectTypes.Zombie]: Zombie
    },
    scenes: {
        IntroScene,
        MainScene
    }
}

const game = new Game(config, AssetsToPreload)

async function start() {
    await game.start('IntroScene')
    game.setAudioVolume(0.1)
}

start()
