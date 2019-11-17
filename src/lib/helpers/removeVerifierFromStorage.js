import getEncodedVerifierKey from './getEncodedVerifierKey'
export const removeVerifierFromStorage = ({ clientId, storage }) => {
  const key = getEncodedVerifierKey(clientId);
  storage.removeItem(key);
}
