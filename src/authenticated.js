import React, {useContext, useEffect, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import crypto from 'crypto'
import { getLocalToken } from './local-token'
import {base64URLEncode, sha256} from './sha256-base64-url-encode'

export function hashed(o) {
  return Object
    .getOwnPropertyNames(o)
    .map(prop => `${ prop }=${ encodeURIComponent(o[prop]) }`)
    .join('&')
}



export const  Authenticated = ({ children }) => {

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
    console.log("url is ", url)
    const url = `${ provider }/authorize?${ hashed(query) }`
    window.location.replace(url)
  }
  
  const authContext = useContext(_authContext)
  const {clientId, clientSecret, pkce, provider} = authContext
  console.log('this is the auth context ', authContext)
  const [ token, setToken ] = useState(null)
  useEffect(() => {
    if (!token) {
      const codeFromUrlHashValues = null // TODO
      if (codeFromUrlHashValues) {
        const token = 12345 // TODO: look up token via fetch
        setToken(token)
      }
      // need to authorize
      const authUrl = provider + "/login" // TODO: create authUrl
      window.location = authUrl
    }
  }, [ ])

  if (!token) {
    // authorize(authContext)
    return <p>Logging in...</p>
  } else {
    return children({ token })
  }
}


