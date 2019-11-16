import React, {createContext, useState, useEffect} from 'react'
import authorize from './helpers/authorize'

export default ({ clientId, clientSecret, provider }) => {
  const token = null

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

  const useToken = () => {
    if (!token) {
      throw new Error('You can only use "useToken" within the children of an "Authenticated" component. Check the docs.')
    }
    return token
  }

  return {
    AuthContext: context,
    Authenticated,
    useToken
  }
}
