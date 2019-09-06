<template>
  <div class="shell" id="shell">
    <div class="topbar">
      {{ store.current.path }} | {{ store.current.file }}
      <button @click="save()">Save</button>
    </div>
    <div class="playground" id="playground">
      <div v-if="file" class="window" id="window">
        <component
          @select_in_gue="select"
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
  </div>
</template>

<script>
import fs from 'fs'
import parser from '../code/parser'
import encoder from '../code/encoder'
import Styling from '@/components/Styling'
import Explorer from '@/components/Explorer'
import interact from 'interactjs'
export default {
  components: {
    Styling,
    Explorer
  },
  data() {
    return {
      selected: null,
      component: null,
      styles: [],
      style: [],
      file: null,
      src: ''
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
          encoder(path, this.component, this.style)
        } else {
          this.file = null
        }
      } else {
        this.file = null
      }
    },
    select(e) {
      /* eslint-disable */
      this.selected = JSON.parse(e.target.getAttribute('data-original'))
      /* eslint-enable */
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
            this.styles = parsed.styles
            this.style = parsed.style
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
  bottom: 0;
  float: left;
  width: calc(100% - 230px);
  height: calc(100% - 40px);
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
