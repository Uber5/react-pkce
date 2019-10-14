export function hashed(o) {
  return Object
    .getOwnPropertyNames(o)
    .map(prop => `${ prop }=${ encodeURIComponent(o[prop]) }`)
    .join('&')
}

export function reverseHashed(o) {
  // const decoded = decodeURIComponent(o)
  // const pattern = /code*&/
  
  // console.log(value.split('&'))
  return Object
    .getOwnPropertyNames(o)
    .map(prop => `${ prop }=${ encodeURIComponent(o[prop]) }`)
}
