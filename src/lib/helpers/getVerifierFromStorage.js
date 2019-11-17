import getEncodedVerifierKey from './getEncodedVerifierKey'
export const getVerifierFromStorage = ({ clientId, storage }) => {
  const key = getEncodedVerifierKey(clientId);
  const value = storage.getItem(key);
  return value;
}
