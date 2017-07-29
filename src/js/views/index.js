import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Game from '../components/game'
import { tickTime, startTicker, updateMousePos } from '../actions'

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    viewport: PropTypes.object,
    multiplier: PropTypes.number,
    lastFrameTime: PropTypes.number,
    tickerStarted: PropTypes.bool,
    mousePos: PropTypes.array,
    // from connect
    dispatch: PropTypes.func
}

class AppContainer extends Component {
    constructor (props) {
        super(props)
        this.wrapper = null
        this.updateMousePos = this.updateMousePos.bind(this)
        this.startTicker = this.startTicker.bind(this)
    }

    render () {
        return (
            <Game {...this.props}
                startTicker={this.startTicker}
                updateMousePos={this.updateMousePos} />
        )
    }

    startTicker () {
        const { tickerStarted, dispatch } = this.props
        // const interval = 1000 / 60
        // const first = performance.now()
        // let then = first
        // let counter = 0

        const ticker = () => {
            // const ts = performance.now()
            // const delta = ts - then
            // if (delta > interval) {
            //     then = ts - (delta % interval)
            //     ++counter
            //     console.info(parseInt(counter / ((then - first) / 1000)) + 'fps')
            // }
            dispatch(tickTime())
            window.requestAnimationFrame(ticker)
        }

        if (!tickerStarted) {
            /*eslint no-console: ["error", { allow: ["info"] }] */
            console.info('Starting ticker')
            dispatch(startTicker())
            ticker()
        }
    }

    updateMousePos (x, y) {
        const { dispatch } = this.props
        dispatch(updateMousePos(x, y))
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.width,
        height: state.height,
        viewport: state.viewport,
        mousePos: state.mousePos,
        multiplier: state.multiplier,
        lastFrameTime: state.lastFrameTime,
        tickerStarted: state.tickerStarted
    }
}

AppContainer.propTypes = propTypes

export default connect(mapStateToProps)(AppContainer)
