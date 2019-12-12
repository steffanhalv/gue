<template>
  <div :id="identity" class="window" :style="style">
    <div class="border-top"></div>
    <div class="border-right"></div>
    <div class="border-bottom"></div>
    <div class="border-left"></div>
    <slot />
  </div>
</template>

<script>
export default {
  props: ['id', 'pos', 'resize', 'width', 'height'],
  data() {
    return {
      style: {
        top: this.getTop(this.pos ? this.pos.top : 0),
        right: this.getRight(this.pos ? this.pos.right : 0),
        bottom: this.getBottom(this.pos ? this.pos.bottom : 0),
        left: this.getLeft(this.pos ? this.pos.left : 0),
        width: this.width ? this.width : 'auto',
        height: this.height ? this.height : 'auto'
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.render()
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
    }
  },
  methods: {
    render() {
      this.style = {
        top: this.getTop(this.pos ? this.pos.top : 0),
        right: this.getRight(this.pos ? this.pos.right : 0),
        bottom: this.getBottom(this.pos ? this.pos.bottom : 0),
        left: this.getLeft(this.pos ? this.pos.left : 0),
        width: this.width ? this.width : 'auto',
        height: this.height ? this.height : 'auto'
      }
    },
    getTop(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let top = document.querySelector(pos).getBoundingClientRect().top
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
        let left = document.querySelector(pos).getBoundingClientRect().left
        return 'calc(100% - ' + left + 'px)'
      } else return pos
    },
    getBottom(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let top = document.querySelector(pos).getBoundingClientRect().top
        return 'calc(100% - ' + top + 'px)'
      } else return pos
    },
    getLeft(pos) {
      if (
        typeof pos === 'string' &&
        pos[0] === '#' &&
        document.querySelector(pos)
      ) {
        let left = document.querySelector(pos).getBoundingClientRect().left
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
}
</style>
