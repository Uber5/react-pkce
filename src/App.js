import React, {useState} from 'react'
import createAuthContext from './lib/createAuthContext'

const clientId = process.env.REACT_APP_CLIENT_ID || "8cb4904ae5581ecc2b3a1774"
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || "b683283462070edbac15a8fdab751ada0f501ab48a5f06aa20aee3be24eac9cc"
const provider = process.env.REACT_APP_PROVIDER || "https://authenticate.u5auth.com"

const {AuthContext, Authenticated, useToken} = createAuthContext({
  clientId,
  clientSecret,
  provider,
  // tokenEndpoint: 'http://localhost:3020/token' // If token endpoint is not "provider + '/token'"
})

function ProtectedStuff() {
  return <Authenticated>
    This would be visible only if logged in.
  </Authenticated>
}

const UseTokenWithoutAuthenticated = () => {
  const token = useToken()
  return <p>token={JSON.stringify(token)}</p>
}

function App() {
  const [showProtected, setShowProtected] = useState(false)
  const [showInvalidTokenUse, setShowInvalidTokenUse] = useState(false)

  return (
    <AuthContext>
      <h1>Auth Demo</h1>
      <p>
        We render the app inside an AuthContext.Provider.
        Nothing requires authentication yet.
      </p>
      <p>
        When you push "reveal", we will show something protected,
        you are only supposed to see it after being authenticated.
      </p>
      <button onClick={() => setShowProtected(!showProtected)}>reveal</button>
      { showProtected && <ProtectedStuff/> }
      <h3>Using useToken()</h3>
      <p>
        Push the button below to show a component which uses useToken()
        incorrectly. It will result in a warning on the dev console,
        unless you are authenticated already.
      </p>
      <button onClick={() => setShowInvalidTokenUse(!showInvalidTokenUse)}>show</button>
      { showInvalidTokenUse && <UseTokenWithoutAuthenticated />}
    </AuthContext>
  )
}

export default App
