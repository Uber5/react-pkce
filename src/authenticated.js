import React from 'react'
import { getLocalToken } from './local-token'
import contextTypes from './context-types'

export function hashed(o) {
  return Object
    .getOwnPropertyNames(o)
    .map(prop => `${ prop }=${ encodeURIComponent(o[prop]) }`)
    .join('&')
}

export const authenticated = () => Component => {
  function authorize(provider, clientId) {
    const query = {
      client_id: clientId,
      response_type: 'token',
      redirect_uri: window.location
    }
    const url = `${ provider }/authorize?${ hashed(query) }`
    window.location.replace(url)
  }
  class Authed extends React.Component {
    render() {
      const token = getLocalToken()
      if (!token) {
        const { clientId, provider, loggingInIndicator } = this.context
        authorize(provider, clientId)
        return (loggingInIndicator || <p>Logging in...</p>)
      } else {
        return <Component {...this.props} />
      }
    }
  }
  Authed.contextTypes = contextTypes
  return Authed
}
