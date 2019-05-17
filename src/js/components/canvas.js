import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'

const propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
}

export default class Canvas extends Component {
    constructor (props) {
        super(props)
        this.canvas = null
        this.context = null
    }

    componentDidMount () {
        const canvas = findDOMNode(this.canvas)
        this.context = canvas.getContext('2d')
        this.context.imageSmoothingEnabled = false
    }

    render () {
        const { width, height } = this.props
        const style = {width: `${width}px`, height: `${height}px`}
        return (
            <canvas ref={(ref) => { this.canvas = ref }} {...style} />
        )
    };
}

Canvas.propTypes = propTypes
