import vdomFromRaw from './vdom_from_raw'
import vdomToRaw from './vdom_to_raw'

export default {
  parse(e) {
    return vdomFromRaw(e)
  },
  stringify(e) {
    return vdomToRaw(e)
  }
}
