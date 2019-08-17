import React from 'react'
import ReactDOM from 'react-dom'
import { AuthContext, authenticated, getLocalToken } from '../src'

const Authed = authenticated()(() => (
  <p>You are authenticated now, your auth token is {getLocalToken()}</p>
))

const App = () => (
  <AuthContext
    provider='https://login-test.u5auth.com'
    clientId='7f196b156cf480873df33665'
    loggingInIndicator={<div className='spinner'></div>}
  >
    <Authed />
  </AuthContext>
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
