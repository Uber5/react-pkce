import getEncodedVerifierKey from './getEncodedVerifierKey'
export const removeStateFromStorage = ({ clientId, storage }) => {
  const key = getEncodedVerifierKey(clientId);
  storage.removeItem(key);
}
