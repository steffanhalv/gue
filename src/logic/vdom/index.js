import vdomFromRaw from './vdom_from_raw'
import vdomToRaw from './vdom_to_raw'
import vdomEach from './vdom_each'
import attrFromTag from './attributes_from_tag'

export default {
  parse(e) {
    return vdomFromRaw(e)
  },
  stringify(e) {
    return vdomToRaw(e)
  },
  each(e, fs = () => {}, fe = () => {}) {
    return vdomEach(e, fs, fe)
  },
  attrFromTag(e) {
    return attrFromTag(e)
  }
}
