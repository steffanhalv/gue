<template>
  <div>
    <button v-if="!count" @click="$vdom.load()">
      Reload
    </button>
    <div class="layers" :class="count ? '' : 'container'">
      <div class="layer" :key="'lr-' + i" v-for="(layer, i) in layers">
        <div
          :class="layer.visible ? (!layer.tag || (tagName(layer).toLowerCase() === 'template') ? 'text' : 'visible') : 'hidden'"
          class="eye"
          @mouseover="hover(layer)"
          @mouseleave="leave(layer)"
          @click="toggleVisibility(layer)"
        />
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
  watch: {
    '$server.load' (percentage) {
      if (!this.count && percentage === 100) {
        setTimeout(() => {
          this.addStyle()
        }, 100)
      }
    }
  },
  computed: {
    layers() {
      if (this.children) return this.children
      return [this.$vdom.template()]
    }
  },
  methods: {
    addStyle() {
      let css = `
        .gui-hidden {
          display: none
        }
        .gui-hover {
          background: #555
        }
      `
      let el = document.getElementsByTagName('iframe')[0].contentDocument
      let head = el.head
      let style = document.createElement('style')
      style.type = 'text/css'
      style.innerText = css
      head.appendChild(style)
    },
    tagName(layer) {
      if (layer.tag) {
        return vdom.attrFromTag(layer)[0]
      } else {
        return 'Text'
      }
    },
    toggleVisibility(layer) {
      if (layer.tag) {
        let el = document.getElementsByTagName('iframe')[0].contentDocument
        el = el.querySelector('[data-gid="' + layer.id + '"]')
        if (el && el.classList.contains('gui-hidden')) {
          el.classList.remove('gui-hidden')
          layer.visible = true
        } else if (el) {
          el.classList.add('gui-hidden')
          layer.visible = false
        } else {
          layer.visible = true
        }
      }
    },
    hover(layer) {
      if (layer.tag) {
        let el = document.getElementsByTagName('iframe')[0].contentDocument
        el = el.querySelector('[data-gid="' + layer.id + '"]')
        if (el) el.classList.add('gui-hover')
      }
    },
    leave(layer) {
      if (layer.tag) {
        let el = document.getElementsByTagName('iframe')[0].contentDocument
        el = el.querySelector('[data-gid="' + layer.id + '"]')
        if (el) el.classList.remove('gui-hover')
      }
    }
  }
}
</script>

<style scoped>
button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: none;
  background: #444;
  color: #ccc;
  outline: none;
  cursor: pointer;
}
button:hover {
  background: #333;
  color: #fff;
}
.container {
  position: absolute;
  top: 20px;
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
  cursor: pointer;
}
.eye.hidden {
  background: red;
}
.eye.text {
  background: #777;
}
</style>
