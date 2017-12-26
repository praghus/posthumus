import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Canvas from './canvas'
import levelData from '../../assets/levels/posthumus.json'
import { Camera, Player, Elements, World, Renderer } from '../models'
import { select as d3Select, mouse as d3Mouse, touches as d3Touches, event as d3Event } from 'd3'
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
        this.assetsLoaded = false
        this.then = performance.now()
        this.viewport = props.viewport
        this.ticker = props.ticker
        this.assets = props.assets
        this.particlesExplosion = this.particlesExplosion.bind(this)
        this.playSound = this.playSound.bind(this)
    }

    componentDidMount () {
        const dom = d3Select(document)
        const svg = d3Select(this.wrapper)

        this.world = new World(levelData)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.player = new Player(this.world.getPlayer(), this)
        this.elements = new Elements(this.world.getObjects(), this)
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

        const { interval } = this.ticker
        const now = performance.now()
        const delta = now - this.then

        // obey 60 fps limit
        if (delta > interval) {
            this.elements.update()
            this.camera.update()
            this.player.update()
            this.then = now - (delta % interval)
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
                <Canvas ref={(ref) => { this.canvas = ref }} {...{width, height}} />
            </div>
        )
    }

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

    shootExplosion (x, y, color) {
        const particle_count = 5 + parseInt(Math.random() * 5)
        for (let i = 0; i < particle_count; i++) {
            const r = (1 + Math.random())
            this.elements.add({
                x: x,
                y: y,
                width: r,
                height: r,
                type: 'particle',
                properties: {color: color}
            })
        }
    }

    particlesExplosion (x, y) {
        const particle_count = 10 + parseInt(Math.random() * 5)
        for (let i = 0; i < particle_count; i++) {
            const r = (1 + Math.random())
            this.elements.add({
                x: x,
                y: y,
                width: r,
                height: r,
                type: 'particle',
                properties: {color: `rgb(${parseInt(128 + ((Math.random() * 32) * 4))}, 0, 0)`}
            })
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
        this.particlesExplosion(x, y)
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
