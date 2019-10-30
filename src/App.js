import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import { AuthContext, Authenticated} from './lib/index'
import Home from './components/Home'
import Login from './components/Login'

const clientId = process.env.REACT_APP_CLIENT_ID || "47393dcc736027cc5f262d70"
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || "efc068860983e8d03b0c1def339ac1667909874183bd2d80fff464265a6bbfe1"
const provider = process.env.REACT_APP_PROVIDER || "http://localhost:3020"


class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
      <div className="page">
        <AuthContext clientId={clientId} pkce={true} clientSecret={clientSecret} provider={provider}>
          <Authenticated>
            {({token}) => <>
              <Route exact path='/' component={() => <Home token={token}/>} />
              <Route exact path='/login' component={Login}  />
            </>}
          </Authenticated>
        </AuthContext>
      </div>
      </BrowserRouter>
    );
  } 
}

export default App;
