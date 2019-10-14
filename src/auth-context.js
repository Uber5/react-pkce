import React from 'react'
export const authContext = React.createContext({
  
})

const { Provider } = authContext
export default ({ clientId, pkce, clientSecret, provider, ...props }) => {
  // ok(clientId, 'clientId is required')
  return <Provider value={{ clientId, pkce, clientSecret, provider}} {...props} />
}
