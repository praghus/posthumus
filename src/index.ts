import { Game } from 'platfuse'
import { ASSETS, ENTITY_TYPES } from './lib/constants'
import * as Models from './lib/models'
import MainScene from './lib/scenes/main'

const container: any = document.querySelector('#container')
const canvas: any = document.querySelector('#canvas')

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
    const width = window.innerWidth - 100
    const height = window.innerHeight - 100
    const scale = Math.round(height / 160)

    Object.assign(canvas, { width, height })
    Object.assign(container.style, {
        width: `${width}px`,
        height: `${height}px`,
        marginLeft: `-${width / 2}px`,
        marginTop: `-${height / 2}px`
    })
    game.setSize(width, height, scale)
}

game.preload(ASSETS).then(() => {
    game.playScene(0)
    onResize()
})

window.addEventListener('resize', onResize)
