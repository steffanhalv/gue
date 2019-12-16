<template>
  <div class="presentation">
    <button style="position: absolute; right: 120px; top: 10px;" @click="add">
      Add bg color
    </button>
    <button style="position: absolute; right: 5px; top: 10px;" @click="remove">
      Remove bg color
    </button>
    <iframe
      v-if="$server.load === 100"
      style="background: white; border: none; width: 100%; height: 100%"
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

<style scoped>
</style>
