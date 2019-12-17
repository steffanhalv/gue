<template data-gid="0">
  <div data-gid="2" id="app">
    <div data-gid="4">
      <span data-gid="6">hey</span>
    </div>
    <br data-gid="10">
    <img data-gid="12" alt="Vue logo" src="./assets/logo.png">
    <HelloWorld data-gid="14" msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
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
  margin-top: 60px;
}
</style>