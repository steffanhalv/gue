<template>
  <div class="presentation">
    <iframe
      v-if="$server.load === 100"
      style="background: white; border: none; width: 100%; height: 100%"
      :src="$server.local"
    ></iframe>
    <div v-else>Loading {{ $server.load }}%</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    // Serve with hotreload from anywhere
    this.$server.root = '/Users/steffan/Desktop/git/gue/example/'
    this.$server.fix() // Fix linting
    this.$server.serve() // Run hotreload server
    // console.log('Log', this.$server.log)

    // Load any vue file from anywhere
    this.$vdom.root = '/Users/steffan/Desktop/git/gue/example/'
    this.$vdom.file = 'src/App.vue'
    this.$vdom.load() // Load and parse the vue file into virtual dom & append data-gid for identification
    // this.$vdom.unload() // Remove data-gid tags to file and vdom

    // Explore the virtual dom
    // console.log('Template', this.$vdom.template())
    // console.log('Script', this.$vdom.script())
    // console.log('Style', this.$vdom.style())
  },
  watch: {
    '$server.log'() {
      // @todo - Load vdom on file change
      // this.$vdom.load()
    }
  }
}
</script>

<style scoped></style>
