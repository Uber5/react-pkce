import React, {useEffect, useContext, useState} from 'react'
import { authContext as _authContext } from './auth-context'
import {} from '../../helpers/sha256-base64-url-encode'
import { setLocalToken, getLocalToken, getLocalExpiresAt } from '../../local-token'
import {hashed}  from '../../helpers/hashed'

const CodeManager = ({code,state,children }) => {
  console.log('props ', code)
  const authContext = useContext(_authContext)
  const {provider, clientId, clientSecret, pkce} = authContext
  let token = getLocalToken()
  if(!token) {
    if (code) {
      const code_verifier = sessionStorage.getItem('code_verifier')
      let body = {
        clientSecret ,
        clientId,
        code : code, 
        grant_type: "token",
        state : state
      }
      
      if (pkce) {
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
      }
  } 
  return children({token})
}

export default CodeManager
