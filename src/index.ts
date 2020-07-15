import { tmx } from 'tmx-tiledmap'
import { IMG_FILES } from './lib/constants'
import { Game } from './lib/game'
import tiledMap from './assets/map/map.tmx'

const container: any = document.getElementById('container')
const canvas: any = document.getElementById('canvas')
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
const game = new Game(ctx)

/**
 * Preloader
 */
tmx(tiledMap).then((data: any) => {
    let loadedCount = 0
    const loadedImages: TPL.StringTMap<HTMLImageElement> = {}
    const onLoad = () => ++loadedCount === Object.keys(IMG_FILES).length && game.init(data, loadedImages)
    Object.keys(IMG_FILES).map((key) => {
        loadedImages[key] = new Image()
        loadedImages[key].src = IMG_FILES[key]
        loadedImages[key].addEventListener('load', onLoad)
    })
})

const onResize = () => {
    game.onResize()
    const { width, height } = game.viewport
    Object.assign(canvas, { width, height })
    Object.assign(container.style, {
        width: `${width}px`,
        height: `${height}px`,
        marginLeft: `-${width / 2}px`,
        marginTop: `-${height / 2}px`
    })
}

/**
 * Events listeners
 */
window.addEventListener('resize', () => onResize())
window.onload = () => onResize()


