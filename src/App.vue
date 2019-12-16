<template>
  <div id="app">
    <shell :windows="windows" />
  </div>
</template>

<script>
import Shell from '@/components/Shell'
import windows from '@/models/windows'
export default {
  components: {
    Shell
  },
  data() {
    return {
      windows
    }
  }
}
</script>

<style>
#app,
html,
body {
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
  background: #555;
}
body {
  margin: 0;
}
</style>
