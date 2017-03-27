import React from 'react'
import contextTypes from '../context-types'
import { hashed } from '../authenticated'
import { getHashValues } from '../lib/utils'

import TokenManager from './token-manager'

export class AuthContext extends React.Component {

  getChildContext() {
    const { provider, clientId } = this.props
    return { provider, clientId }
  }

  render() {

    const state = getHashValues().state
    const showChildren = !(state && state.match(/^refreshing/))

    return (
      <div>
        <TokenManager />
        { showChildren && this.props.children }
      </div>
    )

  }
}

AuthContext.propTypes = contextTypes
AuthContext.childContextTypes = contextTypes
