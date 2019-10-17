import React, {useContext, useEffect, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import crypto from 'crypto'
import {base64URLEncode, sha256} from '../../helpers/sha256-base64-url-encode'
import {hashed} from '../../helpers/hashed'
import {getHashValues} from '../../helpers/utils'
import CodeManager from './code-manager'


export const  Authenticated = ({children }) => {
  const authContext = useContext(_authContext)
  const [ code, setCode] = useState(null)
  const codeFromUrlHashValues = getHashValues()
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
      const codeFromUrlHashValues = getHashValues() // TODO
      if (codeFromUrlHashValues) {

        let body = {
          clientSecret ,
          clientId,
          code : code, 
          grant_type: "token",
          state : state
        }
        
        if (pkce) {
          const code_verifier = sessionStorage.getItem('code_verifier')
          body.grant_type = "authorization_code"
          body.code_verifier = code_verifier
        }
        fetch(`${provider}/token`,{
          method: "POST",
          body : JSON.stringify(body)
        })
        .then((response) => {
          const expires_in = new Date("2020-11-10") //TODO: will get it from the reponse
          console.log('this is the response ', response)
          setLocalToken(token,expires_in)
          return children({token})
        })
        .catch((err) => new Error('this is the error ', err))
        
        // const _code = // TODO: look up token via fetch
        // setCode(codeFromUrlHashValues)
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


