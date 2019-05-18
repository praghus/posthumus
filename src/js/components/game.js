import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import fx from 'glfx'
import Debug from './debug'
import Canvas from './canvas'
import Inputs from './inputs'
import {
    ASSETS,
    SCENES
} from '../lib/constants'
import {
    IntroScene,
    GameScene
} from '../lib/scenes'
import {
    assetPropType,
    inputPropType,
    tickerPropType,
    viewportPropType,
    configPropType
} from '../lib/prop-types'

const propTypes = {
    assets: assetPropType.isRequired,
    config: configPropType.isRequired,
    input: inputPropType.isRequired,
    onConfig: PropTypes.func.isRequired,
    onKey: PropTypes.func.isRequired,
    onMouse: PropTypes.func.isRequired,
    playSound: PropTypes.func.isRequired,
    setScene: PropTypes.func.isRequired,
    startTicker: PropTypes.func.isRequired,
    ticker: tickerPropType.isRequired,
    viewport: viewportPropType.isRequired
}

export default class Game extends Component {
    constructor (props) {
        super(props)
        this.assetsLoaded = false
        this.wrapper = null
        this.scene = null
        this.scenes = null
        this.canvas = null
        this.source = null
        this.texture = null
        this.ctx = null
    }

    componentDidMount () {
        const { startTicker } = this.props
        this.ctx = this.canvas.context
        this.scenes = {
            [SCENES.INTRO]: new IntroScene(this.ctx, this.props),
            [SCENES.GAME]: new GameScene(this.ctx, this.props)
        }
        // this.setOpenGlEffects()
        startTicker()
    }

    componentWillReceiveProps (nextProps) {
        const { config: { scene } } = nextProps
        if (this.scene !== scene) {
            this.scene = this.scenes[scene] || null
        }
        this.scene && this.scene.update(nextProps)
    }

    componentDidUpdate () {
        const {
            assets,
            viewport: { width, height }
        } = this.props

        if (this.ctx && this.scene) {
            this.scene.draw()
            /** Experimental: create CRT scanlines effect */
            if (this.glcanvas) {
                this.ctx.drawImage(assets[ASSETS.SCANLINES], 0, 0, width, height)
                this.texture.loadContentsOf(this.source)
                this.glcanvas
                    .draw(this.texture)
                    .bulgePinch(
                        Math.round(width / 2),
                        Math.round(height / 2),
                        width * 0.75,
                        0.12
                    )
                    .vignette(0.25, 0.74)
                    .update()
            }
        }
    }

    render () {
        const {
            config,
            onConfig,
            onKey,
            viewport: { width, height }
        } = this.props
        const fps = this.scene && this.scene.fps || 0
        return (
            <div ref={(ref) => { this.wrapper = ref }}>
                <Canvas ref={(ref) => { this.canvas = ref }} {...{ width, height }} />
                <Inputs {...{ onKey }} />
                <Debug {...{ config, onConfig, fps }} />
            </div>
        )
    }

    /** Experimental */
    setOpenGlEffects () {
        try {
            this.source = findDOMNode(this.canvas)
            this.glcanvas = fx.canvas()
            this.texture = this.glcanvas.texture(this.source)
            // Hide the source 2D canvas and put the WebGL Canvas in its place
            this.source.parentNode.insertBefore(this.glcanvas, this.source)
            this.source.style.display = 'none'
            this.glcanvas.className = this.source.className
            this.glcanvas.id = this.source.id
            this.source.id = `old_${this.source.id}`
        }
        catch (e) {
            return
        }
    }
}

Game.propTypes = propTypes
