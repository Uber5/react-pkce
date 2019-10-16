import React, {useContext, useEffect, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import crypto from 'crypto'
import {base64URLEncode, sha256} from '../../helpers/sha256-base64-url-encode'
import {hashed} from '../../helpers/hashed'
import {getHashValues} from '../../helpers/utils'
import CodeManager from './code-manager'


export const  Authenticated = ({props, children }) => {
  const authContext = useContext(_authContext)
  const [ code, setCode] = useState(null)

  function authorize({provider, pkce, clientId}) {
    
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
  
  useEffect(() => {
    if (!code) {
      const hashedUri = getHashValues()
      console.log('query array ', hashedUri)
      const codeFromUrlHashValues = null // TODO
      if (codeFromUrlHashValues) {
        const _code = 12345 // TODO: look up token via fetch
        setCode(_code)
      }
      // need to authorize
      authorize(authContext)
    }
  }, [code])

  return <CodeManager code={code} state={"state 1234456778"}>
    {
      ({token}) => {
        if (!token) {
          // authorize(authContext)
          return <p>Logging in...</p>
        } else {
          return children({ token })
        }
      }
    }
  </CodeManager>
  
}


