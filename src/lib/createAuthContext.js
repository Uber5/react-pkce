import React, {createContext, useState, useEffect} from 'react'
import authorize from './helpers/authorize'

const getCodeFromLocation = ({ location }) => {
  const split = location.toString().split('?')
  if (split.length < 2) {
    return null
  }
  const pairs = split[1].split('&')
  for (const pair of pairs) {
    const [ key, value ] = pair.split('=')
    if (key === 'code') {
      return decodeURIComponent(value || '')
    }
  }
  return null
}

const removeCodeFromLocation = () => {
  const [ base, search ] = window.location.href.split('?')
  if (!search) {
    return
  }
  const newSearch = search.split('&')
    .map(param => param.split('='))
    .filter(([ key ]) => key !== 'code')
    .map(keyAndVal => keyAndVal.join('='))
    .join('&')
  window.history.replaceState(window.history.state, null, newSearch.length ? `?${newSearch}` : '')
}

const getVerifierFromStorage = ({ clientId, storage = sessionStorage }) => {
  const key = 'encodedVerifier-' + encodeURIComponent(clientId) // TODO: magic key
  const value = storage.getItem(key)
  storage.setItem(key, null)
  return value
}

export default ({ clientId, clientSecret, provider }) => {
  let token = null

  // TODO: need to do this within a React component,
  // otherwise we cannot set the context via the provider
  const code = getCodeFromLocation({ location: window.location })
  if (code) {
    removeCodeFromLocation()
  }
  const verifier = getVerifierFromStorage({ clientId })
  console.log('code, verifier', code, verifier)
  if (code && verifier) {
    // TODO: get token for code (async, then set in context)
  }

  const context = createContext({
    clientId,
    clientSecret,
    provider,
    token
  })

  const Authenticated = ({ children }) => {
    const [_token, setToken] = useState(token)

    useEffect(() => {
      if (!_token) {
        console.log('must authenticate...')
        if (false) { // TODO: check if code in url

        } else {
          authorize({
            provider,
            clientId
          })
        }
      }
    }, [_token])

    // TODO: also timeout logic?

    if (!_token) {
      return <p>logging in...</p> // TODO: configurable component here
    } else {
      return children
    }
  }

  // const useToken = () => {
  //   if (!token) {
  //     throw new Error('You can only use "useToken" within the children of an "Authenticated" component. Check the docs.')
  //   }
  //   return token
  // }

  return {
    AuthContext: context,
    Authenticated,
    // useToken
  }
}
