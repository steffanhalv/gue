<template>
  <div class="layers" :class="count ? '' : 'container'">
    <button v-if="!count" @click="$vdom.load()">
      Reload
    </button>
    <div class="layer" :key="'lr-' + i" v-for="(layer, i) in layers">
      <div class="eye" />
      <label
        @mouseover="hover(layer)"
        @mouseleave="leave(layer)"
        :style="'padding-left:' + (20 * (count || 0) + 30) + 'px'"
        >{{ tagName(layer) }}</label
      >
      <layers
        v-if="layer.children.length"
        :children="layer.children"
        :count="count ? count + 1 : 1"
      />
    </div>
  </div>
</template>

<script>
import vdom from '@/logic/vdom/index'
export default {
  name: 'layers',
  props: ['children', 'count'],
  data() {
    return {
      counter: 0
    }
  },
  computed: {
    layers() {
      if (this.children) return this.children
      return [this.$vdom.template()]
    }
  },
  methods: {
    tagName(layer) {
      if (layer.tag) {
        return vdom.attrFromTag(layer)[0]
      } else {
        return 'Text'
      }
    },
    hover(layer) {
      if (layer.tag) {
        let el = document.getElementsByTagName('iframe')[0]
        el = el.contentDocument || el.contentWindow.document
        el = el.querySelector('[data-gid="' + layer.id + '"]')
        if (el) el.style.background = '#333'
      }
    },
    leave(layer) {
      if (layer.tag) {
        let el = document.getElementsByTagName('iframe')[0]
        el = el.contentDocument || el.contentWindow.document
        el = el.querySelector('[data-gid="' + layer.id + '"]')
        if (el) el.style.background = 'transparent'
      }
    }
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.layers {
  text-align: left;
}
.layer {
  position: relative;
  box-sizing: border-box;
}
label {
  display: inline-block;
  width: 100%;
  text-transform: capitalize;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: #555;
  border-bottom: 2px solid #505050;
  cursor: pointer;
}
label:hover {
  background-color: #444;
}
.eye {
  position: absolute;
  top: 8px;
  left: 5px;
  padding: 6px;
  border-radius: 50%;
  background: green;
  display: inline-block;
}
</style>
