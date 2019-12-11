export default (vdom, start, end) => {
  let iterate = nodes => {
    nodes.forEach(node => {
      start(node)
      iterate(node.children)
      end(node)
    })
  }
  iterate(vdom)
  return vdom
}
