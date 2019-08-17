import PropTypes from 'prop-types'

const contextTypes = {
  provider: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  loggingInIndicator: PropTypes.element
}

export default contextTypes
