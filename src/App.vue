<template>
  <div id="app">
    <button style="position: absolute; right: 120px; top: 10px;" @click="add">Add bg color</button>
    <button style="position: absolute; right: 5px; top: 10px;" @click="remove">Remove bg color</button>
    <div style="height: 150px; overflow: auto">
      <div :key="'log-' + i" v-for="(log, i) in $server.log">
        <span
          style="font-family: monospace; display: inline-block; text-align: left; white-space: nowrap; width: 100%"
        >
          {{ '$: ' + log }}
        </span>
      </div>
    </div>
    <iframe
      v-if="$server.load === 100"
      style="background: white; border: none; width: 100%; height: calc(100% - 150px)"
      :src="$server.local"
    ></iframe>
    <div v-else>Loading {{ $server.load }}%</div>
  </div>
</template>

<script>
import vdom from '@/logic/vdom/index'
export default {
  data() {
    return {}
  },
  created() {
    // Serve with hotreload from anywhere
    this.$server.root = '/Users/steffan/Desktop/git/gue/example/'
    this.$server.fix() // Fix linting
    this.$server.serve() // Run hotreload server
    console.log('Log', this.$server.log)

    // Load any vue file from anywhere
    this.$vdom.root = '/Users/steffan/Desktop/git/gue/example/'
    this.$vdom.file = 'src/App.vue'
    this.$vdom.load() // Load and parse the vue file into virtual dom & append data-gid for identification
    this.$vdom.unload() // Remove data-id tags to file and vdom

    // Explore the virtual dom
    console.log('Template', this.$vdom.template())
    console.log('Script', this.$vdom.script())
    console.log('Style', this.$vdom.style())
  },
  methods: {
    add() {
      // Manipulate the dom
      let app = this.$vdom.template().children[1]
      let attr = vdom.attrFromTag(app)
      attr = vdom.attrSet(attr, 'style="background: red"')
      app.start = vdom.attrToTag(attr)
      this.$vdom.save()
    },
    remove() {
      // Reset your changes
      let app = this.$vdom.template().children[1]
      let attr = vdom.attrFromTag(app)
      attr = vdom.attrRemove(attr, 'style')
      app.start = vdom.attrToTag(attr)
      this.$vdom.save()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden !important;
  min-height: 0 !important;
  width: 100%;
  height: 100%;
  position: absolute;
}
body {
  margin: 0;
}
</style>
