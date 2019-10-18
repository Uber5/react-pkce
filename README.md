# What is It?

A simple React component using `React Hooks` to facilitate authentication
via U5-Auth (or rather, any OAuth2 provider). It is based on the Proof Key for Code Exchange [PKCE Spec](https://tools.ietf.org/html/rfc7636) 

# Prerequisites

* The provider url, e.g. `https://login.u5auth.com`.
* pkce `boolean value` (compulsory)
* OAuth2 client credentials, where the client is allowed to use the
  [Authorization code grant](https://tools.ietf.org/html/rfc6749#section-4.1).
* A [React]() application, which is supposed to be secured via OAuth2 (or
  rather, needs an `access_token` to authenticate e.g. calls to APIs).

# How

## Setup

Client details need to be specified via the `AuthContext` component. The `AuthContext` must wrap any component that needs authentication, so the `AuthContext` is probably best placed high up in the component tree (maybe just above the router, if you use one):

First, import the `AuthContext and Authencated` component:

```javascript
import { AuthContext, Authenticated } from 'react-u5auth'
```

Then, wrap your component(s):

```react
<AuthContext clientId={"123"} clientSecret={0987654321} pkce={true} provider={"https://my-provider.com"}>
  <Authenticated>
  {
  	({token}) => <>
  	  <Router history={browserHistory}>
       // ...
     </Router>
  	</>
  }
  </Authenticated>
</AuthContext>
```

## Protecting Components

Now, the higher-order function `authenticated` can be used to ensure a valid `access_token` whenever the component gets rendered:

**Example 1.js (class based component)**

```js
class SomeComponent extends React.Component {
  render() {
    return <p>Some component that needs an authenticated user...</p>
  }
}
export SomeComponent

```

**Example 2.js (Pure/ functional component)**

```js
Example 1.js (class based component)

const SomeComponent = () => {
	//logic
	return <>Some component that needs an authenticated user...</>
}

export SomeComponent

```

**Note:** This is all you need to protect the component(s). You don't need to add anything to your components at this point.

## Using the `access_token`

The access token can be recieved via the props by the children of the `Authenticated` component


# Status

It's fully functional, but does not deal with token expiry and/or certain error conditions yet. See the
[issues and/or add a new issue](https://github.com/Uber5/react-u5auth/issues).
