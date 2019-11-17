export const fetchToken = ({ clientId, clientSecret, code, verifier, tokenEndpoint, fetch = window.fetch }) => {
  const payload = {
    client_secret: clientSecret,
    client_id: clientId,
    code,
    grant_type: 'authorization_code',
    code_verifier: verifier
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
