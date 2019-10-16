import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom'
import { AuthContext, Authenticated} from './lib/index'
import Home from './components/Home'
import Login from './components/Login'

const clientId = process.env.REACT_APP_CLIENT_ID || "630635d76d121e8673435ea6"
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || "630635d76d121e8673435ea6"
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
