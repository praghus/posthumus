import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Canvas from './canvas'
import levelData from '../../assets/levels/posthumus.json'
import { Camera, Elements, World, Renderer } from '../models'
import { updateMousePos, updateKeyPressed } from '../actions'

const propTypes = {
    assets: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    startTicker: PropTypes.func.isRequired,
    ticker: PropTypes.object.isRequired,
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
        this.fps = 0
        this.lastLoop = null
        this.frameTime = null
        this.then = performance.now()
        this.assetsLoaded = false
        this.viewport = props.viewport
        this.ticker = props.ticker
        this.assets = props.assets
        this.playSound = this.playSound.bind(this)
        this.updateMousePos = this.updateMousePos.bind(this)
    }

    componentDidMount () {
        this.world = new World(levelData)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.elements = new Elements(this.world.getObjects(), this)
        this.player = this.elements.create(this.world.getPlayer())
        this.camera.center()

        this.wrapper.addEventListener('click', this.updateMousePos, false)
        document.addEventListener('keydown', ({code}) => this.onKey(code, true))
        document.addEventListener('keyup', ({code}) => this.onKey(code, false))

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

    componentWillUnmount () {
        this.wrapper.removeEventListener('click', this.updateMousePos, false)
        document.removeEventListener('keydown', ({code}) => this.onKey(code, true))
        document.removeEventListener('keyup', ({code}) => this.onKey(code, false))
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
        const now = performance.now()
        const currentFrameTime = now - this.lastLoop
        this.frameTime += (currentFrameTime - this.frameTime) / 100
        this.fps = 1000 / this.frameTime
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

    updateMousePos (event) {
        const { dispatch } = this.props
        const {x, y} = event
        dispatch(updateMousePos(x, y))
    }

    playSound (sound) {
        const { dispatch } = this.props
        dispatch(sound())
    }
}

Game.propTypes = propTypes
