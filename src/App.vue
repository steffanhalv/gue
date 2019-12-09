<template>
  <div id="app">
    <iframe
      style="border: none; width: 100%; height: 100%"
      src="http://localhost:8080"
    ></iframe>
  </div>
</template>

<script>
import gid from '@/logic/add_gid'
export default {
  created() {
    gid()
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
