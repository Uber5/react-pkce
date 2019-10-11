import React, {useContext, useEffect, useState} from 'react'
import AuthContext from './auth-context'


export const  authenticated = ({ children }) => {
  const authContext = useContext(AuthContext)
  console.log("here is the context ", authContext)
  sessionStorage.setItem(`context`, authContext)
  // const [ token, setToken ] = useState(null)
  if (!token) {
    return <p>Logging in...</p>
  } else {
    return children({ token : 123456})
  }
}

