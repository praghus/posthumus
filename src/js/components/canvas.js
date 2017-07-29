import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'

const propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

export default class Canvas extends Component {
    constructor (props) {
        super(props)
        this.canvas = null
        this.context = null
    }

    componentDidMount () {
        const canvas = findDOMNode(this.canvas)
        const ctx = canvas.getContext('2d')
        this.context = ctx
    }

    render () {
        const { width, height } = this.props
        return (
            <canvas
                ref={(ref) => { this.canvas = ref }}
                width={width + 'px'} height={height + 'px'} />
        )
    };
}

Canvas.propTypes = propTypes
