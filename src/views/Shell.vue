<template>
  <div class="shell" id="shell" :key="render">
    <div class="topbar" id="topbar">
      <button @click="selecting=!selecting">{{ selecting ? 'Preview' : 'Select'}}</button>
      <button @click="events=!events">{{ events ? 'Default' : 'All clickable'}}</button>
      {{ store.current.path }} | {{ store.current.file }}
      <button @click="save()">Save</button>
    </div>
    <div class="toolbar" id="toolbar-left">
      <attributes class="toolbar__container" :selected="selected" />
      <styling class="toolbar__container" :selected="motion" @motion="motion = $event" />
    </div>
    <div class="playground" id="playground">
      <div v-if="file" class="window" id="window" :class="{
        selecting,
        'all-events': events
      }">
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
    <div class="toolbar" id="toolbar-right">
      <explorer class="toolbar__container" />
      <dom @select="select" :element="selected" v-if="component" class="toolbar__container" :template="component.template"/>
    </div>
    <div class="bottombar">
      <timeline
        v-if="$refs && $refs.component && $refs.component.animations"
        @motion="motion = $event"
        @update="data = $event, Object.assign($refs.component, $event)"
        :element="selected && selected[':motion'] ? selected[':motion'] : null"
        :data="data"/>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import tosource from 'tosource'
import parser from '../code/parser'
import encoder from '../code/encoder'
import Attributes from '@/components/Attributes'
import Styling from '@/components/Styling'
import Explorer from '@/components/Explorer'
import Timeline from '@/components/Timeline'
import Dom from '@/components/Dom'
import interact from 'interactjs'
export default {
  components: {
    Attributes,
    Styling,
    Explorer,
    Timeline,
    Dom
  },
  data() {
    return {
      motion: null,
      selecting: false,
      events: false,
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
    interact('#toolbar-right')
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
          document.getElementById('shell').offsetWidth - document.getElementById('toolbar-left').offsetWidth - event.rect.width + 'px'
      })
    interact('#toolbar-left')
      .resizable({
        edges: { left: false, right: true, bottom: false, top: false },
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
          document.getElementById('shell').offsetWidth - document.getElementById('toolbar-right').offsetWidth - event.rect.width + 'px'
        document.getElementById('playground').style.left =
          event.rect.width + 'px'
      })
    interact('.bottombar')
      .resizable({
        edges: { left: false, right: false, bottom: false, top: true },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent',
            endOnly: true
          }),
          interact.modifiers.restrictSize({
            min: { height: 5 },
            max: { height: 900 }
          })
        ],
        inertia: true
      })
      .on('resizemove', function(event) {
        var target = event.target
        var y = parseFloat(target.getAttribute('data-y')) || 0
        target.style.height = event.rect.height + 'px'
        y += event.deltaRect.bottom
        target.setAttribute('data-y', y)
        let h = document.getElementById('shell').offsetHeight - document.getElementById('topbar').offsetHeight - event.rect.height + 'px'
        let b = event.rect.height + 'px'
        document.getElementById('playground').style.height = h
        document.getElementById('playground').style.bottom = b
        document.getElementById('toolbar-left').style.height = h
        document.getElementById('toolbar-left').style.bottom = b
        document.getElementById('toolbar-right').style.height = h
        document.getElementById('toolbar-right').style.bottom = b
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
        document.querySelectorAll(
          '[data-identifier="' +
            this.target.getAttribute('data-identifier') +
            '"]'
        )[0].setAttribute('data-original', JSON.stringify(val))
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
      if (e.target) this.target = e.target
      else this.target = e
      Array.prototype.slice.call(
        document.getElementsByClassName('gue-selection')
      ).forEach(el => {
        el.classList.remove('gue-selection')
      })
      this.target.classList.add('gue-selection')
      this.selected = JSON.parse(this.target.getAttribute('data-original'))

      document.querySelectorAll(
          '[data-identifier="' +
            this.target.getAttribute('data-identifier') +
            '"]'
        )[0].classList.add('gue-selection')
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
.window.selecting .gue-element-hover {
  cursor: pointer;
  background-color: rgb(72, 137, 235, .8);
  opacity: .8!important;
  filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-180deg) saturate(600%) contrast(0.8)
}
.window .gue-selection {
  background-color: rgba(72, 235, 72, 0.8);
  opacity: .8!important;
  filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-90deg) saturate(600%) contrast(0.8)
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
  left: 230px;
  bottom: 300px;
  float: left;
  width: calc(100% - 460px);
  height: calc(100% - 340px);
  background-color: #222;
}
#toolbar-right {
  right: 0;
}
.toolbar {
  position: absolute;
  bottom: 300px;
  width: 230px;
  height: calc(100% - 340px);
  box-sizing: border-box;
  touch-action: none;
  overflow: auto;
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
.toolbar__container {
  height: 50%;
  overflow-y: auto;
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
