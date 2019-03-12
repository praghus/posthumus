import PropTypes from 'prop-types'

export const assetPropType = PropTypes.objectOf(PropTypes.object)

export const inputPropType = PropTypes.shape({
    keyPressed: PropTypes.object,
    mousePos: PropTypes.array
})

export const tickerPropType = PropTypes.shape({
    interval: PropTypes.number.isRequired,
    tickerStarted: PropTypes.bool.isRequired,
    lastFrameTime: PropTypes.number
})

export const viewportPropType = PropTypes.shape({
    height: PropTypes.number.isRequired,
    resolutionX: PropTypes.number.isRequired,
    resolutionY: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
})
