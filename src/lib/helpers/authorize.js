import { base64URLEncode, sha256 } from "./sha256-base64-url-encode"
import createCodeVerifier from './create-code-verifier'
import hashed from './hashed'
import getEncodedVerifierKey from './getEncodedVerifierKey'

export default function authorize({provider, clientId, storage = sessionStorage}) {

  const encodedVerifier = base64URLEncode(createCodeVerifier())
  storage.setItem(
    getEncodedVerifierKey(clientId),
    encodedVerifier
  )

  const query = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: window.location,
    code_challenge: base64URLEncode(sha256(encodedVerifier)),
    code_challenge_method: 'S256',
  }
  
  const url = `${ provider }/authorize?${ hashed(query) }`
  window.location.replace(url)
}
