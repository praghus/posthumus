import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Canvas from './canvas'
import Inputs from './inputs'
import { SCENES } from '../lib/constants'
import { IntroScene, GameScene } from '../lib/scenes'

import {
    assetPropType,
    inputPropType,
    tickerPropType,
    viewportPropType
} from '../lib/prop-types'

const propTypes = {
    assets: assetPropType.isRequired,
    input: inputPropType.isRequired,
    onKey: PropTypes.func.isRequired,
    onMouse: PropTypes.func.isRequired,
    playSound: PropTypes.func.isRequired,
    startTicker: PropTypes.func.isRequired,
    ticker: tickerPropType.isRequired,
    viewport: viewportPropType.isRequired
}

export default class Game extends Component {
    constructor (props) {
        super(props)
        this.viewport = props.viewport
        this.ticker = props.ticker
        this.assets = props.assets
        this.playSound = props.playSound.bind(this)
        this.wrapper = null
        this.assetsLoaded = false
        this.scene = null
        this.scenes = null
        this.setScene = this.setScene.bind(this)
    }

    componentDidMount () {
        const { startTicker } = this.props
        this.ctx = this.canvas.context
        this.scenes = {
            [SCENES.INTRO]: new IntroScene(this),
            [SCENES.GAME]: new GameScene(this)
        }
        this.setScene(SCENES.INTRO)
        startTicker()
    }

    componentWillReceiveProps (nextProps) {
        if (this.scene) {
            this.scene.update(nextProps)
        }
    }

    componentDidUpdate () {
        if (this.ctx && this.scene) {
            this.scene.draw()
        }
    }

    render () {
        const { onKey, viewport } = this.props
        const { width, height } = viewport
        return (
            <div ref={(ref) => { this.wrapper = ref }}>
                <Canvas ref={(ref) => { this.canvas = ref }} {...{ width, height }} />
                <Inputs {...{ onKey }} />
            </div>
        )
    }

    setScene (scene) {
        this.scene = this.scenes[scene] || null
    }
}

Game.propTypes = propTypes
