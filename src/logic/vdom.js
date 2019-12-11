import Vue from 'vue'
import vdom from '@/logic/vdom/index'
import fs from 'fs'

export default new Vue({
  data() {
    return {
      file: '',
      root: '',
      vdom: null
    }
  },
  methods: {
    load(file = this.file) {
      let content = fs.readFileSync(this.root + file, {
        encoding: 'utf8'
      })
      this.vdom = vdom.parse(content)
      this.setGid()
      this.save()
    },
    unload() {
      this.setGid(true)
      this.save()
    },
    save(file = this.file) {
      let raw = vdom.stringify(this.vdom)
      fs.writeFileSync(this.root + file, raw, {
        encoding: 'utf8',
        flag: 'w'
      })
    },
    template() {
      return this.tag()
    },
    script() {
      return this.tag('script')
    },
    style() {
      return this.tag('style')
    },
    setGid(remove = false) {
      let i = 0
      let node = this.template()
      let id = i++
      if (remove) delete node.id
      else node.id = id
      let attributes = vdom.attrFromTag(node)
      if (remove) attributes = vdom.attrRemove(attributes, 'data-gid')
      else attributes = vdom.attrSet(attributes, 'data-gid="' + id + '"')
      node.start = vdom.attrToTag(attributes)
      vdom.each(node.children, node => {
        let id = i++
        if (remove) delete node.id
        else node.id = id
        if (node.tag) {
          attributes = vdom.attrFromTag(node)
          if (remove) attributes = vdom.attrRemove(attributes, 'data-gid')
          else attributes = vdom.attrSet(attributes, 'data-gid="' + id + '"')
          node.start = vdom.attrToTag(attributes)
        }
      })
    },
    tag(tag = 'template') {
      let n = null
      this.vdom.forEach(node => {
        if (
          node.start.toLowerCase().indexOf('<' + tag + ' ') === 0 ||
          node.start
            .toLowerCase()
            .replace(/ /g, '')
            .indexOf('<' + tag + '>') === 0
        ) {
          n = node
        }
      })
      return n
    }
  }
})
