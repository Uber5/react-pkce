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
  function authorize(provider, pkce, clientId) {
    let query = {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: window.location
    }
    if(pkce == true) {
      query.code_challenge = "ieinufnw0nfh84hfnneb0ub4bw"
      query.code_challenge_method = "S256"
    }
    
    const url = `${ provider }/authorize?${ hashed(query) }`
    window.location.replace(url)
  }
  class Authed extends React.Component {
    render() {
      const token = getLocalToken()
      if (!token) {
        const { clientId, pkce, provider, loggingInIndicator } = this.context
        authorize(provider, pkce, clientId)
        return (loggingInIndicator || <p>Logging in...</p>)
      } else {
        return <Component {...this.props} />
      }
    }
  }
  Authed.contextTypes = contextTypes
  return Authed
}
