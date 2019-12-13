<template>
  <div :id="identity" class="window" :style="style">
    <div
      v-if="hooks.top"
      class="border-top"
      @mousedown="$emit('move', '')"
      @mouseup=";(dropped = 'top'), $emit('drop', 'self')"
    ></div>
    <div
      v-if="hooks.right"
      class="border-right"
      @mousedown="$emit('move', '')"
      @mouseup=";(dropped = 'right'), $emit('drop', 'self')"
    ></div>
    <div
      v-if="hooks.bottom"
      class="border-bottom"
      @mousedown="$emit('move', '')"
      @mouseup=";(dropped = 'bottom'), $emit('drop', 'self')"
    ></div>
    <div
      v-if="hooks.left"
      class="border-left"
      @mousedown="$emit('move', '')"
      @mouseup=";(dropped = 'left'), $emit('drop', 'self')"
    ></div>
    <div class="header">
      <button class="remove" @click="remove">
        X
      </button>
      <span
        style="display: inline-block; color: #666; font-size: .8em; padding-top: 4px"
        >#{{ id }}</span
      >
      <button class="move" @mousedown="$emit('move', 'self')">
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
  props: [
    'id',
    'position',
    'links',
    'resize',
    'width',
    'height',
    'update',
    'move',
    'drop',
    'parent'
  ],
  data() {
    return {
      dropped: '',
      pos: null,
      hooks: null,
      style: {
        top: this.getTop(this.pos ? this.pos.top : 0),
        right: this.getRight(this.pos ? this.pos.right : 0),
        bottom: this.getBottom(this.pos ? this.pos.bottom : 0),
        left: this.getLeft(this.pos ? this.pos.left : 0),
        minWidth: this.width ? this.width : '100px',
        minHeight: this.height ? this.height : '100px'
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
    drop() {
      if (this.drop.id === this.id) {
        if (this.move && this.move.id !== this.drop.id) {
          // Remove it
          this.$emit('update', {
            id: this.move.id,
            pos: this.move.pos,
            hooks: this.move.hooks
          })

          // Store reference
          let drop = this.drop
          let move = this.move
          let dropped = this.dropped

          // After
          setTimeout(() => {
            move.pos.top = drop.pos.top
            move.pos.right = drop.pos.right
            move.pos.bottom = drop.pos.bottom
            move.pos.left = drop.pos.left
            move.hooks.top = drop.hooks.top
            move.hooks.right = drop.hooks.right
            move.hooks.bottom = drop.hooks.bottom
            move.hooks.left = drop.hooks.left

            this.parent.forEach(el => {
              Object.keys(el.hooks).forEach(key => {
                if (el.hooks[key] === '#' + drop.id) {
                  if (
                    (dropped === 'top' && key === 'bottom') ||
                    (dropped === 'bottom' && key === 'top') ||
                    (dropped === 'right' && key === 'left') ||
                    (dropped === 'left' && key === 'right')
                  ) {
                    el.hooks[key] = '#' + move.id
                    if (el.pos[key] === '#' + drop.id)
                      el.pos[key] = '#' + move.id
                  } else if (
                    (dropped === 'top' && key !== 'top' && key !== 'bottom') ||
                    (dropped === 'bottom' &&
                      key !== 'bottom' &&
                      key !== 'top') ||
                    (dropped === 'right' &&
                      key !== 'right' &&
                      key !== 'left') ||
                    (dropped === 'left' && key !== 'left' && key !== 'right')
                  ) {
                    el.hooks[key] = ['#' + drop.id, '#' + move.id]
                  }
                } else if (isArray(el.hooks[key])) {
                  let arr = []
                  let found = false
                  el.hooks[key].forEach(hook => {
                    if (hook === '#' + drop.id) {
                      found = true
                    } else {
                      arr.push(hook)
                    }
                  })
                  if (found) {
                    if (
                      (dropped === 'top' && key === 'bottom') ||
                      (dropped === 'bottom' && key === 'top') ||
                      (dropped === 'right' && key === 'left') ||
                      (dropped === 'left' && key === 'right')
                    ) {
                      arr.push('#' + move.id)
                      el.hooks[key] = arr
                      if (el.pos[key] === '#' + drop.id)
                        el.pos[key] = '#' + move.id
                    } else if (
                      (dropped === 'top' &&
                        key !== 'top' &&
                        key !== 'bottom') ||
                      (dropped === 'bottom' &&
                        key !== 'bottom' &&
                        key !== 'top') ||
                      (dropped === 'right' &&
                        key !== 'right' &&
                        key !== 'left') ||
                      (dropped === 'left' && key !== 'left' && key !== 'right')
                    ) {
                      arr.push('#' + drop.id)
                      arr.push('#' + move.id)
                      el.hooks[key] = arr
                    }
                  }
                }
              })
            })

            if (dropped === 'top') {
              move.pos.bottom = '#' + drop.id
              drop.pos.top = '#' + move.id
              move.hooks.bottom = '#' + drop.id
              drop.hooks.top = '#' + move.id
            } else if (dropped === 'right') {
              move.pos.left = '#' + drop.id
              drop.pos.right = '#' + move.id
              move.hooks.left = '#' + drop.id
              drop.hooks.right = '#' + move.id
            } else if (dropped === 'bottom') {
              move.pos.top = '#' + drop.id
              drop.pos.bottom = '#' + move.id
              move.hooks.top = '#' + drop.id
              drop.hooks.bottom = '#' + move.id
            } else if (dropped === 'left') {
              move.pos.right = '#' + drop.id
              drop.pos.left = '#' + move.id
              move.hooks.right = '#' + drop.id
              drop.hooks.left = '#' + move.id
            }

            setTimeout(() => {
              this.$emit('resize')
              // this.$emit('remove', this.move.id)
              // this.$destroy()
            }, 1)
          })
        }
        // Do stuff
        this.$emit('drop', '')
        this.$emit('move', '')
      }
    },
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
        minWidth: this.width ? this.width : '100px',
        minHeight: this.height ? this.height : '100px'
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
