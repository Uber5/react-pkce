
// TODO: HAck, is it ?
export const getHashValues = () => {
  const requestUrl = window.location
  const splitted = requestUrl.search.split("&")
  const redirect_url = requestUrl.origin + requestUrl.pathname
  const code = splitted[0].substring(6)
  return {code, redirect_url}
}
