import vdomEach from './vdom_each'
export default vdom => {
  let raw = ''
  vdomEach(
    vdom,
    node => {
      raw += node.start
    },
    node => {
      raw += node.end
    }
  )
  return raw
}
