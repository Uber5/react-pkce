
// TODO: HAck
export const getHashValues = () => {
  const hash = window.location
  console.log('hashed value ', hash)
  const splitted = hash.search.split("&")
  const redirect_url = hash.origin + hash.pathname
  console.log('redirect url ', redirect_url)
  const code = splitted[0].substring(6)
  return {code, redirect_url}
    // return hash
    //   .substring(1)
    //   .split('&')
    //   .reduce((o, kv) => {
    //     const a = kv.split('=');
    //     o[a[0]] = a[1];
    //     return o;
    //   }, {});
  // else {
  //   return {}
  // }
}
