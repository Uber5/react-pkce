export const exhancgeRefreshTokenForAccessToken = ({ clientId, clientSecret, tokenEndpoint, fetch = window.fetch, token }) => {
  const payload = {
    client_secret: clientSecret,
    client_id: clientId,
    grant_type: "refresh_token",
    scope: "openid, profile",
    refresh_token: token.refresh_token
  };
  return fetch(tokenEndpoint, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then(r => {
      if (!r.ok) {
        throw new Error(`Token response not ok, status is ${r.status}, check the react-u5auth configuration (wrong provider or token endpoint?)`);
      }
      return r.json();
    })
    .then(token => {
      const { expires_in } = token;
      if (expires_in && Number.isFinite(expires_in)) {
        const slackSeconds = 10;
        // add 'expires_at', with the given slack
        token.expires_at = new Date(new Date().getTime() + expires_in * 1000 - (slackSeconds * 1000));
      }
      return token;
    })
    .catch(err => {
      console.error('ERR (fetch)', err);
      throw err;
    });
}
