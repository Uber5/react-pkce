import PropTypes from 'prop-types'

const contextTypes = {
  provider: PropTypes.string.isRequired,
  pkce: PropTypes.bool.isRequired,
  clientSecret : PropTypes.string,
  clientId: PropTypes.string.isRequired,
  loggingInIndicator: PropTypes.element
}

export default contextTypes
