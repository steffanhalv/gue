export default arr => {
  let raw = '<'
  arr.forEach(attr => {
    raw += attr + ' '
  })
  return raw.slice(0, -1) + '>'
}
