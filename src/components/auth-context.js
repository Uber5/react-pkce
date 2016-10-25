import React from 'react'
import { setLocalToken } from '../local-token'
import contextTypes from '../context-types'

export class AuthContext extends React.Component {
  getChildContext() {
    const { provider, clientId } = this.props
    return { provider, clientId }
  }
  render() {
    console.log('window.location', window.location)
    const hash = window.location.hash
    if (hash.match(/^#/)) {
      const results = hash
      .substring(1)
      .split('&')
      .reduce((o, kv) => { const a = kv.split('='); o[a[0]] = a[1]; return o; }, {});
      if (results.access_token) {
        setLocalToken(results.access_token)
        window.location.hash = ""
      }
    }
    return this.props.children
  }
}

AuthContext.propTypes = contextTypes
AuthContext.childContextTypes = contextTypes
