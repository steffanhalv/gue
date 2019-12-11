export default obj => {
  let raw = ''
  let appendToRaw = nodes => {
    nodes.forEach(node => {
      if (typeof node === 'string') {
        raw += node
      } else {
        raw += node.start
        appendToRaw(node.children)
        raw += node.end
      }
    })
  }
  appendToRaw(obj)
  return raw
}
