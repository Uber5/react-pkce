import React, {useState} from 'react'
import {getLocalToken} from '../../local-token'
export const authContext = React.createContext({
  
})

const { Provider } = authContext
export default ({ clientId, pkce, clientSecret, provider,  ...props }) => {
  const [token, setToken] = useState(getLocalToken())
  console.log('here are the props ', props)
  // TODO: more, and strict, validation
  if (!(pkce === true || pkce === false)) {
    throw new Error('invalid pkce value')
  }
  // ok(clientId, 'clientId is required')
  return <Provider value={{ clientId, pkce, clientSecret, provider, token, setToken}} {...props} />
}
