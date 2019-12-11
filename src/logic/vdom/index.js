import vdomFromRaw from './vdom_from_raw'
import vdomToRaw from './vdom_to_raw'
import vdomEach from './vdom_each'
import attrFromTag from './attributes_from_tag'
import attrToTag from './attributes_to_tag'
import attrSet from './attributes_set'
import attrRemove from './attributes_remove'

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
  },
  attrToTag(e) {
    return attrToTag(e)
  },
  attrSet(e, t) {
    return attrSet(e, t)
  },
  attrRemove(e, t) {
    return attrRemove(e, t)
  }
}
