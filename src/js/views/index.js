import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Game } from '../components'
import { requireAll } from '../lib/helpers'
import { tickTime, startTicker } from '../actions'

const allImages = require.context('../../assets/images', true, /.*\.png/)
const images = requireAll(allImages).reduce(
    (state, image) => ({
        ...state, [image.split('/')[2].split('-')[0]]: image
    }), {}
)

const propTypes = {
    ticker: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    viewport: PropTypes.object,
    dispatch: PropTypes.func
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
        const { assetsLoaded } = this.state
        return (
            assetsLoaded
                ? <Game {...this.props} assets={this.assets} startTicker={this.startTicker} />
                : <div>loading assets...</div>
        )
    }

    onAssetLoad () {
        this.setState({ loadedCount: ++this.state.loadedCount })
        if (this.state.loadedCount === Object.keys(images).length) {
            this.setState({ assetsLoaded: true })
        }
    }

    startTicker () {
        const { ticker, dispatch } = this.props
        const tick = () => {
            dispatch(tickTime())
            window.requestAnimationFrame(tick)
        }
        if (!ticker.tickerStarted) {
            /*eslint no-console: ["error", { allow: ["info"] }] */
            console.info('Starting ticker')
            dispatch(startTicker())
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

AppContainer.propTypes = propTypes

export default connect(mapStateToProps)(AppContainer)
