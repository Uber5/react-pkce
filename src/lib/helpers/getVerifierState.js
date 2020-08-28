import getEncodedVerifierKey from './getEncodedVerifierKey'
export const getVerifierState = ({ clientId, storage }) => {
  const key = getEncodedVerifierKey(clientId);
  const value = JSON.parse(storage.getItem(key));
  return value;
}
