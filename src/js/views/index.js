import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Game } from '../components'
import { tickTime, startTicker } from '../actions'

const propTypes = {
    ticker: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    viewport: PropTypes.object,
    // from connect
    dispatch: PropTypes.func
}

class AppContainer extends Component {
    constructor (props) {
        super(props)
        this.wrapper = null
        this.startTicker = this.startTicker.bind(this)
    }

    render () {
        return (
            <Game {...this.props} startTicker={this.startTicker} />
        )
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
