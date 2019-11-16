import React, {createContext, useState, useEffect} from 'react'

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
      }
    }, [_token])

    // TODO: also timeout logic?

    if (!_token) {
      return <p>logging in...</p> // TODO: configurable component here
    } else {
      return children
    }
  }

  const useToken = () => token

  return {
    AuthContext: context,
    Authenticated,
    useToken
  }
}
