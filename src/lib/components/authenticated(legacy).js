import React from 'react'
import { getLocalToken } from '../../local-token'
import contextTypes from '../../context-types'
import crypto from 'crypto'
import {base64URLEncode, sha256} from '../../helpers/sha256-base64-url-encode'

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
      response_type: 'token',
      redirect_uri: window.location
    }
    
    if(pkce === true) {
      const code_verifier = base64URLEncode(crypto.randomBytes(32))
      sessionStorage.setItem("code_verifier",code_verifier)
      query.code_challenge = base64URLEncode(sha256(code_verifier))
      query.code_challenge_method = "S256"
      query.response_type = "code"
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
