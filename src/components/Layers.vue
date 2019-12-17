<template>
  <div>
    <button v-if="!count" @click="$vdom.load()">
      Reload
    </button>
    <button v-if="!count" @click="$vdom.unload()">
      Unload
    </button>
    <div v-if="!count" class="hovering">{{ hovering }}</div>
    <div v-if="!count" class="selected">{{ selected }}</div>
    <div class="layers" :class="count ? '' : 'container'">
      <div class="layer" :key="'lr-' + i" v-for="(layer, i) in layers">
        <div
          :class="
            layer.visible
              ? !layer.tag ||
                (tagName(layer).toLowerCase() === 'template' && !count)
                ? 'text'
                : 'visible'
              : 'hidden'
          "
          class="eye"
          @mouseover="
            hover(layer),
              count ? $emit('hover', layer.id) : (hovering = layer.id)
          "
          @mouseleave="
            leave(layer), count ? $emit('hover', '') : (hovering = '')
          "
          @click="toggleVisibility(layer)"
        />
        <label
          @click="count ? $emit('select', layer.id) : (selected = layer.id)"
          @mouseover="
            hover(layer),
              count ? $emit('hover', layer.id) : (hovering = layer.id)
          "
          @mouseleave="
            leave(layer), count ? $emit('hover', '') : (hovering = '')
          "
          :class="{
            current: current.toString() === layer.id.toString(),
            next: next.toString() === layer.id.toString()
          }"
          :style="'padding-left:' + (20 * (count || 0) + 30) + 'px'"
          >{{ tagName(layer) }}</label
        >
        <layers
          v-if="layer.children.length"
          @hover="count ? $emit('hover', $event) : (hovering = $event)"
          @select="count ? $emit('select', $event) : (selected = $event)"
          :current="current"
          :next="next"
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
  props: ['children', 'count', 'current', 'next'],
  data() {
    return {
      hovering: '',
      selected: ''
    }
  },
  watch: {
    '$server.load'(percentage) {
      if (!this.count && percentage === 100) {
        setTimeout(() => {
          this.init()
        }, 200)
      }
    },
    selected() {
      if (!this.count) {
        this.$emit('selected', this.selected)
        let el = document.getElementsByTagName('iframe')[0].contentDocument
        el.querySelectorAll('[data-gid]').forEach(it => {
          it.classList.remove('gui-selected')
        })
        el = el.querySelector('[data-gid="' + this.selected + '"]')
        if (el) el.classList.add('gui-selected')
      }
    },
    hovering() {
      if (!this.count) this.$emit('hovering', this.hovering)
    }
  },
  computed: {
    layers() {
      if (this.children) return this.children
      return [this.$vdom.template()]
    }
  },
  methods: {
    init() {
      let css = `
        .gui-hidden {
          display: none
        }
        .gui-hover {
          background: rgba(0, 0, 0, 0.1)
        }
        .gui-selected {
          background: rgba(0, 0, 0, 0.05)
        }
      `
      let el = document.getElementsByTagName('iframe')[0].contentDocument
      let head = el.head
      let style = document.createElement('style')
      style.type = 'text/css'
      style.innerText = css
      head.appendChild(style)
      el.querySelectorAll('[data-gid]').forEach(item => {
        item.addEventListener('click', event => {
          event.preventDefault()
          event.stopPropagation()
          this.selected = item.dataset.gid
        })
        item.addEventListener('mouseenter', () => {
          el.querySelectorAll('[data-gid]').forEach(it => {
            it.classList.remove('gui-hover')
          })
          item.classList.add('gui-hover')
          this.hovering = item.dataset.gid
        })
        item.addEventListener('mouseover', () => {
          let found = false
          el.querySelectorAll('[data-gid]').forEach(it => {
            if (it.classList.contains('gui-hover')) found = true
          })
          if (!found) {
            item.classList.add('gui-hover')
            this.hovering = item.dataset.gid
          }
        })
        item.addEventListener('mouseleave', () => {
          item.classList.remove('gui-hover')
          this.hovering = ''
        })
      })
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
        this.hovering = layer.id
      }
    },
    leave(layer) {
      if (layer.tag) {
        let el = document.getElementsByTagName('iframe')[0].contentDocument
        el = el.querySelector('[data-gid="' + layer.id + '"]')
        if (el) el.classList.remove('gui-hover')
        this.hovering = ''
      }
    }
  }
}
</script>

<style scoped>
button {
  float: left;
  width: 50%;
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
  bottom: 20px;
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
label.current {
  background-color: #444;
}
label:hover,
label.next {
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
.hovering,
.selected {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 16px;
  border: none;
  background: #444;
  color: #ccc;
  font-size: 0.8em;
}
.selected {
  right: 0;
}
</style>
