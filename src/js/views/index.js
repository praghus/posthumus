import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Game } from '../components'
import { requireAll } from '../lib/helpers'
import { inputPropType, tickerPropType, viewportPropType } from '../lib/prop-types'
import { startTicker, tickTime, updateKeyPressed, updateMousePos, playSound } from '../actions'
const allImages = require.context('../../assets/images', true, /.*\.png/)
const images = requireAll(allImages).reduce(
    (state, image) => ({...state, [image.split('-')[0]]: image}), {}
)

const propTypes = {
    input: inputPropType.isRequired,
    onKey: PropTypes.func.isRequired,
    onMouse: PropTypes.func.isRequired,
    playSound: PropTypes.func.isRequired,
    ticker: tickerPropType.isRequired,
    tickerStart: PropTypes.func.isRequired,
    tickerTick: PropTypes.func.isRequired,
    viewport: viewportPropType
}

class AppContainer extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loadedCount: 0,
            assetsLoaded: false
        }
        this.then = performance.now()
        this.assets = {}
        this.wrapper = null
        this.onAssetLoad = this.onAssetLoad.bind(this)
        this.startTicker = this.startTicker.bind(this)
    }

    componentDidMount () {
        Object.keys(images).map((key) => {
            this.assets[key] = new Image()
            this.assets[key].src = images[key]
            this.assets[key].addEventListener('load', this.onAssetLoad)
        })
    }

    render () {
        const { loadedCount, assetsLoaded } = this.state
        const percent = Math.round((loadedCount / Object.values(this.assets).length) * 100)
        return (
            assetsLoaded
                ? <Game {...this.props} assets={this.assets} startTicker={this.startTicker} />
                : <div className='preloader'>Loading assets {percent}%</div>
        )
    }

    onAssetLoad () {
        this.setState({ loadedCount: ++this.state.loadedCount })
        if (this.state.loadedCount === Object.keys(images).length) {
            this.setState({ assetsLoaded: true })
        }
    }

    startTicker () {
        const { ticker, tickerStart, tickerTick } = this.props
        const { requestAnimationFrame } = window

        const tick = () => {
            tickerTick()
            requestAnimationFrame(tick)
        }
        if (!ticker.tickerStarted) {
            tickerStart()
            tick()
        }
    }
}

const mapStateToProps = (state) => {
    return {
        viewport: state.viewport,
        input: state.input,
        ticker: state.ticker
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onKey: (key, pressed) => dispatch(updateKeyPressed(key, pressed)),
        onMouse: (event) => dispatch(updateMousePos(event.x, event.y)),
        playSound: (type) => dispatch(playSound(type)),
        tickerStart: () => dispatch(startTicker(performance.now())),
        tickerTick: () => dispatch(tickTime(performance.now()))
    }
}

AppContainer.propTypes = propTypes

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
