# What is It?

This zero-dependency package enables [React](https://reactjs.org/) applications
to use an OAuth2 provider for
authentication. The OAuth2 provider must support the
[PKCE Spec](https://tools.ietf.org/html/rfc7636).

(TODO: Links to resources that explain why this is a good idea / better than
using the implicit flow.)

Check the [live demo](https://uber5.github.io/react-pkce-sample/)
([source](https://github.com/Uber5/react-pkce-sample)).
When prompted to login, you can signup with email (use link at the bottom of the form).

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

You probably need those in other files, so you may want to `export` them:

```js
export { AuthContext, Authenticated, useToken }
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

## Options

In addition to the required properties (`clientId` etc), the following properties can be specified when calling `createAuthContext()`:

- `busyIndicator`: A React element to be rendered while logging in, e.g. `<Spinner />`.
- `fetch`: HTTP requests to talk to the OAuth2 provider are done using `window.fetch`, unless you specify your own `fetch` function as a property.
- `storage`: By default, authentication information (the token) is kept in `window.sessionStorage`. If you want to use different storage (e.g. `window.localStorage`), set this property. (TODO: won't work yet, as we don't check expiry of tokens!)
- `tokenEndpoint`: The default token endpoint is `${provider}/token`. Configure a different token endpoint here, if your OAuth2 provider does not follow this convention.


# Example

Check the live demo (see above), also checkout [the test app](./src/App.js).

You can run the example, after cloning the repo, and:

```bash
npm i
npm run start
```

... then connect to http://localhost:3001.


# Status

It's fully functional, but does not deal with token expiry and/or certain error conditions yet. See the
[issues and/or add a new issue](https://github.com/Uber5/react-u5auth/issues).
