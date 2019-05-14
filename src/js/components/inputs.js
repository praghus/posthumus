import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Hammer from 'hammerjs'
import { getKeyPressed } from '../lib/utils/helpers'
import { INPUTS } from '../lib/constants'

const propTypes = {
    onKey: PropTypes.func.isRequired
}

export default class Inputs extends Component {
    constructor (props) {
        super(props)
        this.onTouchEvent = this.onTouchEvent.bind(this)
    }

    componentDidMount () {
        const { onKey } = this.props

        this.leftPad = Hammer(this.lpad)
        this.rightPad = Hammer(this.rpad)

        this.rightPad.on('press tap', this.onTouchEvent)
        this.leftPad.on('pan panend', this.onTouchEvent)

        document.addEventListener('keydown', ({code}) => onKey(getKeyPressed(code), true))
        document.addEventListener('keyup', ({code}) => onKey(getKeyPressed(code), false))
    }

    componentWillUnmount () {
        const { onKey } = this.props

        document.removeEventListener('keydown', ({code}) => onKey(code, true))
        document.removeEventListener('keyup', ({code}) => onKey(code, false))

        this.rightPad.off('press tap', this.onTouchEvent)
        this.leftPad.off('pan panend', this.onTouchEvent)
    }

    render () {
        return (
            <div className='hammer-controls'>
                <div className='left-pad' ref={(ref) => { this.lpad = ref }} />
                <div className='right-pad' ref={(ref) => { this.rpad = ref }} />
            </div>
        )
    }

    onTouchEvent (event) {
        const { onKey } = this.props
        const { additionalEvent, deltaX, type } = event
        switch (type) {
        case 'pan':
            if (additionalEvent === 'panleft' && deltaX < -10) {
                onKey(INPUTS.INPUT_RIGHT, false)
                onKey(INPUTS.INPUT_LEFT, true)
            }
            else if (additionalEvent === 'panright' && deltaX > 10) {
                onKey(INPUTS.INPUT_LEFT, false)
                onKey(INPUTS.INPUT_RIGHT, true)
            }
            break
        case 'panend':
            onKey(INPUTS.INPUT_LEFT, false)
            onKey(INPUTS.INPUT_RIGHT, false)
            break
        case 'press':
            onKey(INPUTS.INPUT_ACTION, true)
            setTimeout(() => onKey(INPUTS.INPUT_ACTION, false), 150)
            break
        case 'tap':
            onKey(INPUTS.INPUT_UP, true)
            setTimeout(() => onKey(INPUTS.INPUT_UP, false), 150)
            break
        }
    }
}

Inputs.propTypes = propTypes
