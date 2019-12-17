export default (vdom, start, end) => {
  let iterate = nodes => {
    nodes.forEach(node => {
      start(node)
      iterate(node.children)
      if (end) end(node)
    })
  }
  iterate(vdom)
  return vdom
}
