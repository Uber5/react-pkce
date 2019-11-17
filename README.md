# What is It?

This package enables [React](https://reactjs.org/) applications
to use an OAuth2 provider for
authentication. The OAuth2 provider must support the
[PKCE Spec](https://tools.ietf.org/html/rfc7636).

(TODO: Links to resources that explain why this is a good idea / better than
using the implicit flow.)

# Prerequisites

* The provider url, e.g. `https://login.u5auth.com`
* OAuth2 client credentials (client id and secret),
  where the client is allowed to use the
  [Authorization code grant](https://tools.ietf.org/html/rfc6749#section-4.1).
* A React application, which is supposed to be secured via OAuth2 (or
  rather, needs an `access_token` to authenticate e.g. calls to APIs).

# How

## Install

```
npm i react-pkce
```

## Use

First, create an auth context (and related things):

```js
const clientId = "8cb4904ae5581ecc2b3a1774"
const clientSecret = "b683283462070edbac15a8fdab751ada0f501ab48a5f06aa20aee3be24eac9cc"
const provider = "https://authenticate.u5auth.com"

const {AuthContext, Authenticated, useToken} = createAuthContext({
  clientId,
  clientSecret,
  provider
})
```

Next, use the `AuthContext` to wrap anything that may require
an authenticated user / an access token for an authenticated user.
Typically, you would wrap the whole app inside of an `AuthContext`:

```js
function App() {
  return (
    <AuthContext>
      // ... all my other components, e.g. router, pages, etc.
    </AuthContext>
  )
}
```

Thirdly, when implementing a component that requires an authenticated user,
wrap anything you want to protect from the public in an `Authenticated`
component. This will ensure the user gets authanticated, before anything
wrapped by `Authenticated` gets mounted / rendered:

```js
function ProtectedComponent() {
  return (
    <Authenticated>
      <ProtectedComponent />
    </Authenticated>
  )
}
```

Lastly, if you require the access token, you can use the `useToken()` hook:

```js
function ComponentWithToken() {
  const { access_token } = useToken()
  const [data, setData] = useState(null)
  useEffect(() => {
    if (!data) {
      fetchData({ token: access_token }).then(setData)
    }
  }, [access_token])
  return (
    // render the data (or a loading indicator, while data === null)
  )
}
```

Note: You need to provide your own `fetchData()` function.

# Example

Check [the Sample App](./src/App.js). It is fully functional, and it uses
[Uber5's OAuth2 provider](https://uber5.com).

You can run the example, after cloning the repo:

```
npm install
npm run start
```

... then connect to http://localhost:3001.


# Status

It's fully functional, but does not deal with token expiry and/or certain error conditions yet. See the
[issues and/or add a new issue](https://github.com/Uber5/react-u5auth/issues).
