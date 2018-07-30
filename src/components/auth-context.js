import React from 'react'
import contextTypes from '../context-types'
import { getHashValues } from '../lib/utils'

import TokenManager from './token-manager'

export class AuthContext extends React.Component {
  getChildContext() {
    const { provider, clientId, loggingInIndicator } = this.props
    return { provider, clientId, loggingInIndicator }
  }

  render() {
    const state = getHashValues().state
    const showChildren = !(state && state.match(/^refreshing/))

    return (
      <div>
        <TokenManager onTokenUpdate={this.props.onTokenUpdate} />
        { showChildren && this.props.children }
      </div>
    )
  }
}

AuthContext.propTypes = contextTypes
AuthContext.childContextTypes = contextTypes
