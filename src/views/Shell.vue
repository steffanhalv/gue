<template>
  <div class="shell" id="shell">
    <div class="topbar">
      {{ store.current.path }} | {{ store.current.file }}
      <button @click="save()">Save</button>
    </div>
    <div class="playground" id="playground">
      <div v-if="file" class="window" id="window">
        <component
          ref="component"
          @gue-select="select"
          @gue-mouseover="mouseover"
          @gue-mouseleave="mouseleave"
          v-if="component"
          :is="component"
        ></component>
        <component
          v-for="(s, i) in styles"
          v-html="s"
          :key="i"
          :is="'style'"
        ></component>
        <component
          v-for="(s, i) in style"
          v-html="s"
          :key="i"
          :is="'style'"
        ></component>
      </div>
    </div>
    <div class="toolbar" id="toolbar">
      <styling class="toolbar__styling" :selected="selected" />
      <explorer class="toolbar__explorer" />
    </div>
    <div :key="render" class="bottombar">
      <timeline
        v-if="$refs && $refs.component && $refs.component.animations"
        @update="data = $event, Object.assign($refs.component, $event)"
        :data="data"/>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import tosource from 'tosource'
import parser from '../code/parser'
import encoder from '../code/encoder'
import Styling from '@/components/Styling'
import Explorer from '@/components/Explorer'
import Timeline from '@/components/Timeline'
import interact from 'interactjs'
export default {
  components: {
    Styling,
    Explorer,
    Timeline
  },
  data() {
    return {
      selected: null,
      component: null,
      styles: [],
      style: [],
      file: null,
      src: '',
      render: false,
      data: null
    }
  },
  created() {
    setInterval(() => {
      this.parse()
    }, 1000)
  },
  mounted() {
    this.parse()
    this.getFiles()
    interact('.toolbar')
      .resizable({
        edges: { left: true, right: false, bottom: false, top: false },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent',
            endOnly: true
          }),
          interact.modifiers.restrictSize({
            min: { width: 5 },
            max: { width: 900 }
          })
        ],
        inertia: true
      })
      .on('resizemove', function(event) {
        var target = event.target
        var x = parseFloat(target.getAttribute('data-x')) || 0
        target.style.width = event.rect.width + 'px'
        x += event.deltaRect.right
        target.setAttribute('data-x', x)
        document.getElementById('playground').style.width =
          document.getElementById('shell').offsetWidth - event.rect.width + 'px'
      })
    window.addEventListener('resize', () => {
      document.getElementById('playground').style.width =
        document.getElementById('shell').offsetWidth -
        document.getElementById('toolbar').offsetWidth +
        'px'
    })
  },
  watch: {
    'store.current.path'() {
      this.getFiles()
    },
    selected: {
      deep: true,
      handler(val) {
        console.log(val)
        if (val) this.target.setAttribute('data-original', JSON.stringify(val))
        let t = document.createElement('html')
        t.innerHTML = this.component.template
        t = t.getElementsByTagName('body')[0]
        t.querySelectorAll(
          '[data-identifier="' +
            this.target.getAttribute('data-identifier') +
            '"]'
        )[0].setAttribute('data-original', JSON.stringify(val))
        this.component.template = t.innerHTML
      }
    }
  },
  methods: {
    save() {
      if (
        this.store.current &&
        this.store.current.path &&
        this.store.current.file
      ) {
        let path =
          this.store.current.path + this.src + '/' + this.store.current.file
        let ext = this.store.current.file.split('.').pop()
        if (
          fs.existsSync(path) &&
          fs.lstatSync(path).isFile() &&
          ext === 'vue'
        ) {
          let comp = Object.assign({}, this.component)
          let data
          eval('data = function () { return ' + tosource(this.data) + ' }')
          comp.data = data
          encoder(path, comp, this.style)
        } else {
          this.file = null
        }
      } else {
        this.file = null
      }
    },
    select(e) {
      /* eslint-disable */
      this.target = e.target
      this.selected = JSON.parse(e.target.getAttribute('data-original'))
      /* eslint-enable */
    },
    mouseover(e) {
      Array.prototype.slice.call(
        document.getElementsByClassName('gue-element-hover')
      ).forEach(el => {
        el.classList.remove('gue-element-hover')
      })
      e.target.classList.add('gue-element-hover')
    },
    mouseleave(e) {
      e.target.classList.remove('gue-element-hover')
    },
    parse() {
      if (
        this.store.current &&
        this.store.current.path &&
        this.store.current.file
      ) {
        let path =
          this.store.current.path + this.src + '/' + this.store.current.file
        let ext = this.store.current.file.split('.').pop()
        if (
          fs.existsSync(path) &&
          fs.lstatSync(path).isFile() &&
          ext === 'vue'
        ) {
          let file = fs.readFileSync(path, { encoding: 'utf8' })
          if (file !== this.file) {
            this.file = file
            let parsed = parser(path)
            this.component = parsed.component
            this.data = this.component.data()
            this.styles = parsed.styles
            this.style = parsed.style
            this.$nextTick(() => {
              this.render = !this.render
            })
          }
        } else {
          this.file = null
        }
      } else {
        this.file = null
      }
    },
    getFiles() {
      if (this.store.current && this.store.current.path) {
        let path = this.store.current.path
        if (fs.existsSync(path + '/src')) this.src = '/src'
        else this.src = ''
        fs.readdir(path + this.src, (err, files) => {
          this.store.current.files = files
          if (files) {
            this.store.current.file = files[0]
          }
          this.file = null
        })
      }
    }
  }
}
</script>

<style>
.window.all-events * {
  pointer-events: all!important;
}
.gue-element-hover {
  cursor: pointer;
  background-color: rgb(72, 137, 235, .8);
  opacity: .8;
  filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-180deg) saturate(600%) contrast(0.8)
}
</style>

<style scoped>
.shell {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.playground {
  position: absolute;
  bottom: 300px;
  float: left;
  width: calc(100% - 230px);
  height: calc(100% - 340px);
  background-color: #222;
}
.toolbar {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 230px;
  height: calc(100% - 40px);
  box-sizing: border-box;
  touch-action: none;
}
.topbar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 40px;
  background-color: #555;
  color: #eee;
}
.bottombar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 300px;
  background-color: #555;
  color: #eee;
  overflow: auto;
}
.toolbar__styling {
  height: 60%;
}
.toolbar__explorer {
  height: 40%;
}
.playground *:hover {
  /*
  background: blue !important;
  color: red;
  */
}
.window {
  background-color: #fff;
  position: absolute;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  left: 10px;
  top: 10px;
  overflow: auto;
}
</style>
