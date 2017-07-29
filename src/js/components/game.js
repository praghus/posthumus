import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Canvas from './canvas'
import { Camera, Elements, Player, World, Renderer } from '../models'
import {
    select as d3Select,
    mouse as d3Mouse,
    touches as d3Touches,
    event as d3Event
} from 'd3'
import { requireAll } from '../lib/utils'
import levelData from '../../assets/levels/map.json'

const allImages = require.context('../../assets/images', true, /.*\.png/)
const images = requireAll(allImages).reduce(
    (state, image) => ({
        ...state, [image.split('/')[2].split('-')[0]]: image
    }), {}
)

const propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    startTicker: PropTypes.func.isRequired,
    updateMousePos: PropTypes.func.isRequired,
    multiplier: PropTypes.number,
    mousePos: PropTypes.array,
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
        this.input = {
            left: false,
            right: false,
            down: false,
            up: false
        }
        this.assets = {}
        this.wrapper = null
        this.viewport = props.viewport
    }

    componentDidMount () {
        const dom = d3Select(document)
        const svg = d3Select(this.wrapper)
        Object.keys(images).map((key) => {
            this.assets[key] = new Image()
            this.assets[key].src = images[key]
        })
        this.world = new World(levelData)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.player = new Player(this.world.getPlayer(), this)
        this.elements = new Elements(this.world.getObjects(), this)
        this.camera.center()
        svg.on('mousedown', () => this.updateMousePos())
        svg.on('touchstart', () => this.updateTouchPos())
        dom.on('keydown', () => this.onKey(d3Event.key, true))
        dom.on('keyup', () => this.onKey(d3Event.key, false))
        this.ctx = this.canvas.context
        this.props.startTicker()
    }

    componentWillReceiveProps (nextProps) {
        this.viewport = nextProps.viewport
        this.elements.update()
        this.camera.update()
        this.player.update()
    }

    componentDidUpdate () {
        if (this.ctx) {
            this.renderer.draw()
        }
    }

    render () {
        const { width, height } = this.viewport
        return (
            <div ref={(ref) => { this.wrapper = ref }}>
                <Canvas ref={(ref) => { this.canvas = ref }} {...{width, height}} />
            </div>
        )
    }

    onKey (key, pressed) {
        switch (key) {
        case 'ArrowLeft': this.input.left = pressed
            break
        case 'ArrowRight': this.input.right = pressed
            break
        case 'ArrowDown': this.input.down = pressed
            break
        case 'ArrowUp': this.input.up = pressed
            break
        }
    }

    updateMousePos () {
        const [x, y] = d3Mouse(this.wrapper)
        this.props.updateMousePos(x, y)
    }

    updateTouchPos () {
        const [x, y] = d3Touches(this.wrapper)[0]
        this.props.updateMousePos(x, y)
    }
}

Game.propTypes = propTypes
