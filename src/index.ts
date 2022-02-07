import { Game } from 'platfuse'
import { ASSETS } from './lib/constants'
import MainScene from './lib/scenes/main'

const container: any = document.querySelector('#container')
const canvas: any = document.querySelector('#canvas')

const game = new Game({
    canvas,
    backgroundColor: '#000',
    scenes: [MainScene],
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
