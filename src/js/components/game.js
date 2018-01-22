import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Canvas from './canvas'
import levelData from '../../assets/levels/posthumus.json'
import { Camera, Elements, World, Renderer } from '../models'
import { getKeyPressed } from '../lib/constants'

const propTypes = {
    assets: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    onMouse: PropTypes.func.isRequired,
    onKey: PropTypes.func.isRequired,
    playSound: PropTypes.func.isRequired,
    startTicker: PropTypes.func.isRequired,
    ticker: PropTypes.object.isRequired,
    viewport: PropTypes.object
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
        this.playSound = props.playSound.bind(this)
    }

    componentDidMount () {
        const { onKey, onMouse } = this.props
        this.world = new World(levelData)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.elements = new Elements(this.world.getObjects(), this)
        this.player = this.elements.create(this.world.getPlayer())
        this.camera.center()

        this.wrapper.addEventListener('click', onMouse, false)
        document.addEventListener('keydown', ({code}) => onKey(getKeyPressed(code), true))
        document.addEventListener('keyup', ({code}) => onKey(getKeyPressed(code), false))

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
}

Game.propTypes = propTypes
