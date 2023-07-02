import { Game } from 'platfuse'

import { ENTITY_TYPES } from './lib/constants'
import * as Models from './lib/models'
import Assets from './lib/assets'
import MainScene from './lib/scenes/main'

import './style.css'

const canvas: any = document.querySelector<HTMLCanvasElement>('#canvas')

const game = new Game({
    canvas,
    backgroundColor: '#000',
    scenes: [MainScene],
    entities: {
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
    },
    debug: true
})

const onResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const scale = Math.round(height / 120)

    Object.assign(canvas, { width, height })
    game.setSize(width, height, scale)
}

game.preload(Assets).then(() => {
    game.playScene(0)
    onResize()
})

window.addEventListener('resize', onResize)
