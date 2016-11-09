import React from 'react'
import { getLocalToken } from './local-token'
import contextTypes from './context-types'

export const authenticated = () => Component => {
  function hashed(o) {
    return Object
      .getOwnPropertyNames(o)
      .map(prop => `${ prop }=${ encodeURIComponent(o[prop]) }`)
      .join('&')
  }
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
        const { clientId, provider } = this.context
        authorize(provider, clientId)
        return (<p>Logging in...</p>)
      } else {
        return <Component {...this.props} />
      }
    }
  }
  Authed.contextTypes = contextTypes
  return Authed
}
