let localToken = undefined

function getLocalToken() {
  return localToken
}

function setLocalToken(token) {
  localToken = token
}

export { getLocalToken, setLocalToken }
