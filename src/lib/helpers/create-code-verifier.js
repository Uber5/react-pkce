export default () => {
  const a = new Uint32Array(4) // we want 4 32bit values
  return Array.from(window.crypto.getRandomValues(a))
    .map(i => i.toString(16))
    .join('-')
}
