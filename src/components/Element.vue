<template>
  <div class="styles">
    <button v-if="selected" @click="add">Make red</button>
    <button v-if="selected" @click="remove">Remove style</button>
    {{ selected }}
    <h4>Element</h4>
    <h4>Scope</h4>
    <h4>Global</h4>
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
