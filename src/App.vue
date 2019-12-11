<template>
  <div id="app">
    <div style="height: 150px; overflow: auto">
      <div :key="'log-' + i" v-for="(log, i) in $logic.log">
        <span
          style="font-family: monospace; display: inline-block; text-align: left; white-space: nowrap; width: 100%"
        >
          {{ '$: ' + log }}
        </span>
      </div>
    </div>
    <iframe
      v-if="$logic.load === 100"
      style="background: white; border: none; width: 100%; height: calc(100% - 150px)"
      :src="$logic.local"
    ></iframe>
    <div v-else>Loading {{ $logic.load }}%</div>
  </div>
</template>

<script>
export default {
  created() {}
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
