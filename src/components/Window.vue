<template>
  <div :id="identity" class="window" :style="style">
    <div v-if="hooks.top" class="border-top"></div>
    <div v-if="hooks.right" class="border-right"></div>
    <div v-if="hooks.bottom" class="border-bottom"></div>
    <div v-if="hooks.left" class="border-left"></div>
    <div class="header">
      <button class="remove" @click="remove">
        X
      </button>
      <button class="move">
        M
      </button>
    </div>
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script>
import { isArray } from 'util'
export default {
  props: ['id', 'position', 'links', 'resize', 'width', 'height', 'update'],
  data() {
    return {
      pos: null,
      hooks: null,
      style: {
        top: this.getTop(this.pos ? this.pos.top : 0),
        right: this.getRight(this.pos ? this.pos.right : 0),
        bottom: this.getBottom(this.pos ? this.pos.bottom : 0),
        left: this.getLeft(this.pos ? this.pos.left : 0),
        minWidth: this.width ? this.width : 'auto',
        minHeight: this.height ? this.height : 'auto'
      }
    }
  },
  created() {
    this.pos = this.position
    this.hooks = this.links
  },
  mounted() {
    setTimeout(() => {
      this.$emit('resize')
    })
  },
  computed: {
    identity() {
      return this.id ? this.id : 'win'
    }
  },
  watch: {
    resize() {
      this.render()
    },
    update(el) {
      Object.keys(this.hooks).forEach(key => {
        if (isArray(this.hooks[key])) {
          if (this.hooks[key].length === 0) {
            this.hooks[key] = ''
            this.pos[key] = 0
          } else if (
            this.hooks[key].length === 1 &&
            this.hooks[key][0] === '#' + el.id
          ) {
            this.hooks[key] = el.hooks[key]
            this.pos[key] = el.pos[key]
          } else {
            let arr = []
            this.hooks[key].forEach(id => {
              if (id !== '#' + el.id) {
                arr.push(id)
              }
            })
            this.hooks[key] = arr
            if (this.pos[key] === '#' + el.id) {
              this.pos[key] = this.hooks[key][0]
            }
          }
        } else if (this.hooks[key] === '#' + el.id) {
          this.hooks[key] = el.hooks[key]
          this.pos[key] = el.pos[key]
        }
      })
      this.render()
    }
  },
  methods: {
    remove() {
      this.$emit('update', {
        id: this.id,
        pos: this.pos,
        hooks: this.hooks
      })
      setTimeout(() => {
        this.$emit('resize')
        this.$emit('remove')
        this.$destroy()
      }, 1)
    },
    render() {
      this.style = {
        top: this.getTop(this.pos ? this.pos.top : 0),
        right: this.getRight(this.pos ? this.pos.right : 0),
        bottom: this.getBottom(this.pos ? this.pos.bottom : 0),
        left: this.getLeft(this.pos ? this.pos.left : 0),
        minWidth: this.width ? this.width : 'auto',
        minHeight: this.height ? this.height : 'auto'
      }
    },
    getTop(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let top =
          document.querySelector(pos).getBoundingClientRect().top -
          document.querySelector(pos).parentElement.getBoundingClientRect().top
        let height = document.querySelector(pos).clientHeight
        return 'calc(' + (top + height) + 'px)'
      } else return pos
    },
    getRight(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let left =
          document.querySelector(pos).getBoundingClientRect().left -
          document.querySelector(pos).parentElement.getBoundingClientRect().left
        return 'calc(100% - ' + left + 'px)'
      } else return pos
    },
    getBottom(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let top =
          document.querySelector(pos).getBoundingClientRect().top -
          document.querySelector(pos).parentElement.getBoundingClientRect().top
        return 'calc(100% - ' + top + 'px)'
      } else return pos
    },
    getLeft(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let left =
          document.querySelector(pos).getBoundingClientRect().left -
          document.querySelector(pos).parentElement.getBoundingClientRect().left
        let width = document.querySelector(pos).clientWidth
        return 'calc(' + (left + width) + 'px)'
      } else return pos
    }
  }
}
</script>

<style scoped>
.window {
  position: absolute;
  background-color: #555;
  min-width: 30px;
  min-height: 30px;
  box-sizing: border-box;
  padding: 5px;
  color: white;
}
.container {
  position: absolute;
  top: 26px;
  right: 5px;
  bottom: 5px;
  left: 5px;
}
.header {
  position: absolute;
  width: 100%;
  height: 26px;
  background: #333;
  top: 0;
  left: 0;
}
.remove {
  right: 0;
  cursor: pointer;
}
.move {
  left: 0;
  cursor: move;
}
.move,
.remove {
  position: absolute;
  top: 0;
  width: 26px;
  height: 26px;
  color: #555;
  border: none;
  background-color: #222;
  padding: 0;
  font-weight: bold;
  border-radius: 3px;
}
.move:hover,
.remove:hover {
  background-color: #000;
}
.border-top {
  position: absolute;
  left: 5px;
  top: 0;
  width: calc(100% - 10px);
  height: 5px;
  background-color: rgb(115, 115, 115);
  cursor: ns-resize;
}
.border-right {
  position: absolute;
  right: 0;
  top: 5px;
  width: 5px;
  height: calc(100% - 10px);
  background-color: rgb(115, 115, 115);
  cursor: ew-resize;
}
.border-bottom {
  position: absolute;
  left: 5px;
  bottom: 0;
  width: calc(100% - 10px);
  height: 5px;
  background-color: rgb(100, 100, 100);
  cursor: ns-resize;
}
.border-left {
  position: absolute;
  left: 0;
  top: 5px;
  width: 5px;
  height: calc(100% - 10px);
  background-color: rgb(100, 100, 100);
  cursor: ew-resize;
}
.border-top:hover,
.border-right:hover,
.border-bottom:hover,
.border-left:hover {
  background-color: rgb(56, 172, 244);
  z-index: 1;
}
</style>
