import PropTypes from 'prop-types'

export const tickerPropType = PropTypes.shape({
    interval: PropTypes.number.isRequired,
    tickerStarted: PropTypes.bool.isRequired,
    lastFrameTime: PropTypes.number
})
