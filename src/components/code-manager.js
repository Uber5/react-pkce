import React, {useEffect, useContext, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import {} from '../sha256-base64-url-encode'
import { setLocalToken, getLocalToken, getLocalExpiresAt } from '../local-token'
import {hashed}  from '../lib/hashed'

const CodeManager = ({props, children }) => {
  const authContext = useContext(_authContext)
  const {provider, clientId, clientSecret, pkce} = authContext
  
  useEffect(()=> {
    const code_verifier = JSON.parse(sessionStorage.getItem('code_verifier'))
    let body = {
      clientSecret ,
      clientId,
      code : props.code, 
      grant_type: "token",
      state : props.state
    }
    
    if (pkce) {
      body.grant_type = "authorization_code"
      body.code_verifier = code_verifier
    }
    fetch(`${provider}/token`,{
      method: "POST",
      body
    })
    .then((response) => {
      console.log('this is the response ', response)
    })
  },[])

  return children({token})
}

export default CodeManager
