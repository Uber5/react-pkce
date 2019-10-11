import React from 'react'

const authContext = React.createContext({
  clientId : "",
  provider : "",
  clientSecret : "",
  pkce : false,
  authenticate : () => {

  }
})

export default authContext;