import {createContext} from 'react'

export default ({ clientId, clientSecret, provider }) => {
  const context = createContext({clientId, clientSecret, provider})
  return context
}
