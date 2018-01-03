import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Canvas from './canvas'
import levelData from '../../assets/levels/posthumus.json'
import { Camera, Elements, World, Renderer } from '../models'
import { select as d3Select, mouse as d3Mouse, touches as d3Touches, event as d3Event } from 'd3'
import { updateMousePos, updateKeyPressed } from '../actions'

const propTypes = {
    assets: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    startTicker: PropTypes.func.isRequired,
    ticker: PropTypes.object.isRequired,
    // fps: PropTypes.number,
    viewport: PropTypes.object,
    dispatch: PropTypes.func
}

export default class Game extends Component {
    constructor (props) {
        super(props)
        this.camera = null
        this.elements = null
        this.renderer = null
        this.player = null
        this.world = null
        this.assets = {}
        this.wrapper = null
        this.loadedCount = 0
        this.frameTime = 0
        this.lastLoop = null
        this.assetsLoaded = false
        this.then = performance.now()
        this.viewport = props.viewport
        this.ticker = props.ticker
        this.assets = props.assets
        this.playSound = this.playSound.bind(this)
    }

    componentDidMount () {
        const dom = d3Select(document)
        const svg = d3Select(this.wrapper)

        this.world = new World(levelData)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.elements = new Elements(this.world.getObjects(), this)
        this.player = this.elements.create(this.world.getPlayer())
        this.camera.center()

        svg.on('mousedown', () => this.updateMousePos())
        svg.on('touchstart', () => this.updateTouchPos())
        dom.on('keydown', () => this.onKey(d3Event.code, true))
        dom.on('keyup', () => this.onKey(d3Event.code, false))

        this.ctx = this.canvas.context
        this.props.startTicker()
    }

    componentWillReceiveProps (nextProps) {
        this.assets = nextProps.assets
        this.ticker = nextProps.ticker
        this.input = nextProps.input.keyPressed
        this.viewport = nextProps.viewport
        this.frameStart = performance.now()

        const { interval } = this.ticker
        const delta = this.frameStart - this.then

        // obey 60 fps limit
        if (delta > interval) {
            this.elements.update()
            this.camera.update()
            this.player.update()
            this.then = this.frameStart - (delta % interval)
            this.countFPS()
        }
    }

    componentDidUpdate () {
        if (this.ctx) {
            this.renderer.draw()
        }
    }

    render () {
        const { width, height } = this.props.viewport
        return (
            <div ref={(ref) => { this.wrapper = ref }}>
                <Canvas ref={(ref) => { this.canvas = ref }} {...{ width, height }} />
            </div>
        )
    }

    countFPS () {
        const smoothing = 10
        const now = performance.now()
        const frameTime = now - this.lastLoop
        this.frameTime += (frameTime - this.frameTime) / smoothing
        this.fps = 1000 / this.frameTime
        this.duration = this.frameStart < this.lastLoop ? this.frameTime : now - this.frameStart
        this.lastLoop = now
    };

    onKey (key, pressed) {
        const { dispatch } = this.props
        switch (key) {
        case 'KeyA':
        case 'ArrowLeft':
            dispatch(updateKeyPressed('left', pressed))
            break
        case 'KeyD':
        case 'ArrowRight':
            dispatch(updateKeyPressed('right', pressed))
            break
        case 'KeyS':
        case 'ArrowDown':
            dispatch(updateKeyPressed('down', pressed))
            break
        case 'KeyW':
        case 'ArrowUp':
            dispatch(updateKeyPressed('up', pressed))
            break
        case 'Space':
            dispatch(updateKeyPressed('fire', pressed))
            break
        }
    }

    getRelativePointerPosition (pos) {
        const [x, y] = pos
        const { scale } = this.props.viewport
        return [
            (x / scale) - this.camera.x,
            (y / scale) - this.camera.y
        ]
    }

    updateMousePos () {
        const { dispatch } = this.props
        const [x, y] = this.getRelativePointerPosition(d3Mouse(this.wrapper))
        this.elements.particlesExplosion(x, y)
        dispatch(updateMousePos(x, y))
    }

    updateTouchPos () {
        const { dispatch } = this.props
        const [x, y] = this.getRelativePointerPosition(d3Touches(this.wrapper)[0])
        dispatch(updateMousePos(x, y))
    }

    playSound (sound) {
        const { dispatch } = this.props
        dispatch(sound())
    }
}

Game.propTypes = propTypes
