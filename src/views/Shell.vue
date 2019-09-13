<template>
  <div class="shell" id="shell" :key="render">
    <div class="topbar" id="topbar">
      <button style="margin-right: 20px" @click="save()">Save</button>
      <button @click="selecting=!selecting">{{ selecting ? 'Stop highlighting' : 'Selection higlight'}}</button>
      <button @click="events=!events">{{ events ? 'Allow click through' : 'Dissallow click through'}}</button>
      <span style="position: absolute; right: 5px; bottom: 5px; font-size: .8em">
        {{ store.current.path }} | {{ store.current.file }}
      </span>
    </div>
    <div class="toolbar" id="toolbar-left">
      <styling
        style="height: 100%"
        class="toolbar__container"
        :selected="motion"
        :parent="motionParent"
        @save="save()"
        @render="doRender($event)"
        @parent="motionParent = $event"
        @motion="motion = $event" />
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
      <explorer style="height: 25%" class="toolbar__container" />
      <attributes
        @render="doRender($event)"
        style="height: 25%"
        class="toolbar__container"
        :selected="selected" />
      <dom
        v-if="component"
        @select="select"
        class="toolbar__container"
        :element="selected"
        :template="component.template"/>
    </div>
    <div class="bottombar">
      <timeline
        v-if="$refs && $refs.component && $refs.component.animations"
        @timeline="timelineSelection($event)"
        @motion="motion = $event"
        @parent="motionParent = $event"
        @update="data = $event, Object.assign($refs.component, JSON.parse(JSON.stringify($event))), doScroll()"
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
      motionParent: null,
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
        if (target) target.setAttribute('data-x', x)
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
        if (target) target.setAttribute('data-x', x)
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
        if (target) target.setAttribute('data-y', y)
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
        document.getElementById('toolbar-right').offsetWidth -
        document.getElementById('toolbar-left').offsetWidth +
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
        if (val && this.target) this.target.setAttribute('data-original', JSON.stringify(val))
        let t = document.createElement('html')
        t.innerHTML = this.component.template
        t = t.getElementsByTagName('body')[0]
        let tt = t.querySelectorAll(
          '[data-identifier="' +
            this.target.getAttribute('data-identifier') +
            '"]'
        )[0]
        if (tt) tt.setAttribute('data-original', JSON.stringify(val))
        this.component.template = t.innerHTML
        let d = document.querySelectorAll(
          '[data-identifier="' +
            this.target.getAttribute('data-identifier') +
            '"]'
        )[0]
        if (d) d.setAttribute('data-original', JSON.stringify(val))
      }
    }
  },
  methods: {
    doRender(obj) {
      if (
        obj.parent &&
        this.$refs.component &&
        this.$refs.component.animations &&
        this.$refs.component.animations[obj.parent.key]
      ) {
        // Object.assign(this.$refs.component.animations[obj.parent.key], JSON.parse(JSON.stringify(obj.parent)))
        // this.component.methods.animate(this.$refs.component.animations[obj.parent.key])
        // this.doScroll()
      }
    },
    doScroll() {
      document.querySelector('.window').dispatchEvent(new Event('scroll'))
    },
    timelineSelection(attr) {
      let query = ':motion":"animations[\'' + attr + '\']"'
      Array.prototype.slice.call(
        document.getElementsByClassName('gue-selection')
      ).forEach(el => {
        el.classList.remove('gue-selection')
      })
      Array.prototype.slice.call(
        document.querySelectorAll('.window *')
      ).forEach(el => {
        if (el.dataset.original) {
          if (el.dataset.original.indexOf(query) !== -1) {
            el.classList.add('gue-selection')
            this.target = el
            this.selected = JSON.parse(this.target.getAttribute('data-original'))
          }
        }
      })
    },
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
          this.progress = 0
          Object.keys(this.data.animations).forEach(key => {
            this.progress = 0
            this.data.animations[key].progress = 0
            this.component.methods.animate(this.data.animations[key])
          })
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
        if (el && typeof el !== 'undefined') {
          el.classList.remove('gue-element-hover')
        }
      })
      if (e.target) {
        e.target.classList.add('gue-element-hover')
      }
    },
    mouseleave(e) {
      if (e.target) {
        e.target.classList.remove('gue-element-hover')
      }
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
  background-color: rgb(72, 137, 235, .1);
  opacity: .9!important;
}
.window.selecting .gue-element-hover.gue-selection, .window.selecting .gue-selection {
  background-color: rgb(72, 137, 235, .7);
  opacity: 1!important;
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
.topbar button {
  cursor: pointer;
  float: left;
  height: calc(100% - 10px);
  margin-top: 5px;
  margin-left: 5px;
  border-radius: 2px;
  border: none;
}
.topbar button:hover {
  background: rgb(40, 126, 255);
  color: white;
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
