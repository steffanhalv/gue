<template>
  <div class="styles">
    <button @click="add">Add</button>
    <button @click="remove">Remove</button>
    {{ selected }}
  </div>
</template>

<script>
import vdomEach from '@/logic/vdom/vdom_each'
import vdom from '@/logic/vdom/index'
export default {
  props: ['selected'],
  data() {
    return {}
  },
  methods: {
    add() {
      vdomEach(this.$vdom.vdom, node => {
        if (node.id && node.id.toString() === this.selected.toString()) {
          let attr = vdom.attrFromTag(node)
          attr = vdom.attrSet(attr, 'style="background: red"')
          node.start = vdom.attrToTag(attr)
          this.$vdom.save()
        }
      })
    },
    remove() {
      vdomEach(this.$vdom.vdom, node => {
        if (node.id && node.id.toString() === this.selected.toString()) {
          let attr = vdom.attrFromTag(node)
          attr = vdom.attrRemove(attr, 'style')
          node.start = vdom.attrToTag(attr)
          this.$vdom.save()
        }
      })
    }
  }
}
</script>

<style></style>
