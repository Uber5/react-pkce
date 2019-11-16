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
  // eslint-disable-next-line no-unused-vars
  const [ _, search ] = window.location.href.split('?')
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
        return <p>logging in...</p> // TODO: configurable component here
      } else {
        return children
      }
    }
  }

  return {
    AuthContext: ({children}) => {
      const [token, setToken] = useState(null)

      // if we have no token, but code and verifier are present,
      // then we try to swap code for token
      useEffect(() => {
        if (!token) {
          const code = getCodeFromLocation({ location: window.location })
          const verifier = getVerifierFromStorage({ clientId })
          if (code && verifier) {
            removeCodeFromLocation()
          }
          console.log('code, verifier', code, verifier)
          if (code && verifier) {
            new Promise(res => setTimeout(res, 1500)).then(() => setToken('123')) // TODO: fake
            // TODO: get token for code (async, then set in context)
          }
        }
      }, [token])

      const ensureAuthenticated = () => {
        const code = getCodeFromLocation({ location: window.location })
        if (!token && !code) {
          authorize({provider, clientId})
        }
      }

      return (
        <Provider value={{token, ensureAuthenticated}}>
          {children}
        </Provider>
      )
    },
    Authenticated
  }
}
