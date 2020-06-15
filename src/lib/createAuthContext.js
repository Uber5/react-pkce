import React, {createContext, useState, useEffect, useContext} from 'react'
import authorize from './helpers/authorize'
import { getCodeFromLocation } from './helpers/getCodeFromLocation'
import { fetchToken } from './helpers/fetchToken'
import { removeCodeFromLocation } from './helpers/removeCodeFromLocation'
import { getVerifierFromStorage } from './helpers/getVerifierFromStorage'
import { removeVerifierFromStorage } from './helpers/removeVerifierFromStorage'
import {exchangeRefreshForAccessToken} from './helpers/exchangeRefreshForAccessToken'

export default ({
  clientId,
  clientSecret,
  provider,
  scopes = [],
  tokenEndpoint = `${provider}/token`,
  storage = sessionStorage,
  fetch = window.fetch,
  busyIndicator = <>logging in...</>
}) => {

  const context = createContext({})
  const {Provider} = context

  class Authenticated extends React.Component {
    static contextType = context
    componentDidMount() {
      const { ensureAuthenticated } = this.context
      ensureAuthenticated()
    }
    render() {
      const { token } = this.context
      const { children } = this.props

      if (!token) {
        return busyIndicator
      } else {
        return children
      }
    }
  }

  const useToken = () => {
    const { token, setToken } = useContext(context)
    if (token) {
      const now = new Date()
      const elapsed = new Date(token.expires_at).getTime() - now.getTime()
      const slack = elapsed + 10000
      console.log('djbfagkj')
      if(token.refresh_token) {
        setInterval(() =>exchangeRefreshForAccessToken({clientId, clientSecret, tokenEndpoint, fetch , token })
        .then(response => {
          setToken(response)
        }),slack - elapsed )
      }
      return token
    } else {
      console.warn(`Trying to useToken() while not being authenticated.\nMake sure to useToken() only inside of an <Authenticated /> component.`)
    }
    return token
  }

  return {
    AuthContext: ({children}) => {
      const [token, setToken] = useState(null)

      // if we have no token, but code and verifier are present,
      // then we try to swap code for token
      useEffect(() => {
        if (!token) {
          const code = getCodeFromLocation({ location: window.location })
          const verifier = getVerifierFromStorage({ clientId, storage })
          const slackSeconds = 10
          if (code && verifier) {
            fetchToken({
              clientId, clientSecret, tokenEndpoint, code, verifier, fetch
            })
            .then(setToken)
            .then(() => {
              removeCodeFromLocation()
              removeVerifierFromStorage({ clientId, storage })
            })
            .catch(e => {
              console.error(e)
              alert(`Error fetching auth token: ${e.message}`)
            })
          }
        }
      }, [token])

      const ensureAuthenticated = () => {
        const code = getCodeFromLocation({ location: window.location })
        if (!token && !code) {
          authorize({provider, clientId, scopes})
        }
      }

      return (
        <Provider value={{token, setToken, ensureAuthenticated}}>
          {children}
        </Provider>
      )
    },
    Authenticated,
    useToken
  }
}
