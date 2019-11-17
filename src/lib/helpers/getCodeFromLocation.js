export const getCodeFromLocation = ({ location }) => {
  const split = location.toString().split('?');
  if (split.length < 2) {
    return null;
  }
  const pairs = split[1].split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key === 'code') {
      return decodeURIComponent(value || '');
    }
  }
  return null;
}
