import React, {useContext, useEffect, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import crypto from 'crypto'
import {base64URLEncode, sha256} from '../../helpers/sha256-base64-url-encode'
import {hashed} from '../../helpers/hashed'
import {getHashValues} from '../../helpers/utils'


export const  Authenticated = ({children }) => {
  const authContext = useContext(_authContext)
  const [ code, setCode] = useState(null)
  const [token, setToken] = useState(null)
  function authorize({provider, pkce, clientId}) {
    
    let query = {
      client_id: clientId,
      response_type: 'token',
      redirect_uri: window.location
    }
    
    if(pkce) {
      const code_verifier = base64URLEncode(crypto.randomBytes(32))
      sessionStorage.setItem("code_verifier",code_verifier)
      query.code_challenge = base64URLEncode(sha256(code_verifier))
      query.code_challenge_method = "S256"
      query.response_type = "code"
    }
    const url = `${ provider }/authorize?${ hashed(query) }`
    window.location.replace(url)
  }
  
  useEffect(() => {
    if (!code) {
      const codeFromUrlHashValues = getHashValues().code // TODO
      const {clientSecret, clientId, pkce, provider} =authContext
      if (codeFromUrlHashValues) {

        let body = {
          client_secret: clientSecret ,
          client_id: clientId,
          code: codeFromUrlHashValues, 
          grant_type: "token"
        }
        
        if (pkce) {
          const code_verifier = sessionStorage.getItem('code_verifier')
          body.grant_type = "authorization_code"
          body.code_verifier = code_verifier
        }
        fetch(`${provider}/token`,{
          headers:{
            'Content-type': 'application/json'
          },
          method: "POST",
          body : JSON.stringify(body)
        })
        .then(r => r.json())
        .then((response) => {
          setToken(response.access_token)
          setCode(codeFromUrlHashValues)
          return children({token})
        })
        .catch((err) => new Error('this is the error ', err))
        
      } else {
        // need to authorize
        authorize(authContext)
      }
    }
  }, [ code ])

  if (!token) {
    return <p>Logging in...</p>
  } else {
    return children({ token })
  }
      
  
}


