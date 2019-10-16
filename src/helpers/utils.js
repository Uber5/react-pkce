

export const getHashValues = () => {
  const hash = window.location.hash
  if (hash.match(/^#/)) {
    return hash
      .substring(1)
      .split('&')
      .reduce((o, kv) => {
        const a = kv.split('=');
        o[a[0]] = a[1];
        return o;
      }, {});
  } else {
    return {}
  }
}
