import React from 'react'
import createAuthContext from './lib/createAuthContext'

const clientId = process.env.REACT_APP_CLIENT_ID || "47393dcc736027cc5f262d70"
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || "efc068860983e8d03b0c1def339ac1667909874183bd2d80fff464265a6bbfe1"
const provider = process.env.REACT_APP_PROVIDER || "http://localhost:3020"

const AuthContext = createAuthContext({
  clientId,
  clientSecret,
  provider
})

function App() {
  const [showProtected, setShowProtected] = useState(false)
  return (
    <AuthContext.Provider>
      <h1>Auth Demo</h1>
      <p>
        We render the app inside an AuthContext.Provider.
        Nothing requires authentication yet.
      </p>
      <p>
        When you push "reveal", we will show something protected,
        you are only supposed to see it after being authenticated.
      </p>
      <button>reveal</button>
    </AuthContext.Provider>
  )
}

export default App
