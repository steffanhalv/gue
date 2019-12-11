<template>
  <div id="app">
    <button @click="add">Add bg color</button>
    <button @click="remove">Remove bg color</button>
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
    this.$vdom.file = 'src/App.vue'
    this.$vdom.root = '/Users/steffan/Desktop/git/gue/example/'
    this.$vdom.load() // Insert data-id tags to file and vdom
    this.$vdom.unload() // Remove data-id tags to file and vdom

    console.log('Template', this.$vdom.template())
    console.log('Script', this.$vdom.script())
    console.log('Style', this.$vdom.style())
  },
  methods: {
    add() {
      let app = this.$vdom.template().children[1]
      let attr = vdom.attrFromTag(app)
      attr = vdom.attrSet(attr, 'style="background: red"')
      app.start = vdom.attrToTag(attr)
      this.$vdom.save()
    },
    remove() {
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
