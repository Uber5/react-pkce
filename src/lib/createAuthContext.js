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

const fetchToken = ({ clientId, clientSecret, code, verifier, tokenEndpoint }) => {
  const payload = {
    client_secret: clientSecret ,
    client_id: clientId,
    code, 
    grant_type: 'authorization_code',
    code_verifier: verifier
  }
  return new Promise((resolve, reject) => {
    fetch(tokenEndpoint, {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
    .then(r => {
      console.log('r', r)
      return r.json()
    })
    .then(res => {
      console.log('res', res)
      return resolve(res)
    })
    .catch(reject)
  })
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
  storage.removeItem(key)
  return value
}

export default ({ clientId, clientSecret, provider, tokenEndpoint = `${provider}/token` }) => {

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
            fetchToken({clientId, clientSecret, tokenEndpoint, code, verifier})
            .then(setToken)
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
