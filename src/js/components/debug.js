import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CONFIG } from '../lib/constants'
import { configPropType } from '../lib/prop-types'

const propTypes = {
    config: configPropType.isRequired,
    onConfig: PropTypes.func.isRequired,
    fps: PropTypes.number
}

export default class Debug extends Component {
    render () {
        const { config, onConfig, fps } = this.props
        return (
            <div className='debug'>
                <label>
                    <input
                        type='checkbox'
                        ref={(ref) => { this.checkboxDebug = ref }}
                        defaultChecked={config[CONFIG.DEBUG_MODE]}
                        onChange={() => {
                            this.checkboxDebug.blur()
                            onConfig(
                                CONFIG.DEBUG_MODE,
                                !config[CONFIG.DEBUG_MODE]
                            )
                        }} />
                    Debug
                </label>
                <label>
                    <input
                        type='checkbox'
                        ref={(ref) => { this.checkboxSound = ref }}
                        defaultChecked={config[CONFIG.DISABLE_SOUNDS]}
                        onChange={() => {
                            this.checkboxSound.blur()
                            onConfig(
                                CONFIG.DISABLE_SOUNDS,
                                !config[CONFIG.DISABLE_SOUNDS]
                            )
                        }} />
                    Mute
                </label>
                <div className='fpsmeter'>
                    {fps.toFixed(1)} FPS
                </div>
            </div>
        )
    }
}

Debug.propTypes = propTypes
