let localToken = undefined
let localExpiresAt = undefined

const localStorageKey = 'tokenAndExpiry'

function isExpired(when) {
  return when.getTime() < new Date().getTime() - 60000 // 1 minute slack
}

function getLocalToken() {
  // console.log('getLocalToken', localToken)
  if (!localToken) {
    try {
      const item = window.localStorage.getItem(localStorageKey)
      if (item) {
        const { token, expiresAt } = JSON.parse(item)
        const expiresAtAsDate = new Date(expiresAt)
        if (!isExpired(expiresAtAsDate)) {
          localToken = token
          localExpiresAt = expiresAtAsDate
        }
      }
    } catch (e) {
      //  do nothing
    }
  }
  return localToken
}

function getLocalExpiresAt() {
  return localExpiresAt
}

function setLocalToken(token, expires_in) {
  const expiresAt = expires_in && new Date(new Date().getTime() + expires_in * 1000)
  console.log('setLocalToken', token, expiresAt)
  localToken = token
  try {
    window.localStorage.setItem(localStorageKey, JSON.stringify({
      token,
      expiresAt
    }))
  } catch (e) {
    // do nothing
  }
}

export { getLocalToken, setLocalToken, getLocalExpiresAt }
