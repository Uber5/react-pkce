import React, {useContext, useEffect, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import crypto from 'crypto'
import { getLocalToken } from './local-token'
import {base64URLEncode, sha256} from './sha256-base64-url-encode'
import {hashed, reverseHashed} from './lib/hashed'



export const  Authenticated = ({props, children }) => {
  const authContext = useContext(_authContext)
  const [ token, setToken ] = useState(null)

  function authorize({provider, pkce, clientId}) {
    const queryArray = reverseHashed(window.location)
    console.log('query array ', queryArray)
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
    console.log("query is ", query)
    console.log('hashed query ', hashed(query))
    const url = `${ provider }/authorize?${ hashed(query) }`
    window.location.replace(url)
  }
  
  useEffect(() => {
    
    if (!token) {
      
      const codeFromUrlHashValues = null // TODO
      if (codeFromUrlHashValues) {
        const token = 12345 // TODO: look up token via fetch
        setToken(token)
      }
      // need to authorize
      const url = `${ authContext.provider}/authorize?${ hashed(query) }`
      window.location.replace(url)
    }
  }, [ ])
  const currentToken = getLocalToken()
  if (!currentToken) {
    authorize(authContext)
    return <p>Logging in...</p>
  } else {
    return children({ token })
  }
}


