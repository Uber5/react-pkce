export default function hashed(o) {
  return Object
    .getOwnPropertyNames(o)
    .map(prop => `${ prop }=${ encodeURIComponent(o[prop]) }`)
    .join('&')
}

