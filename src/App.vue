<template>
  <div id="app">
    <div style="width: 20%; float: right">
      <div :key="'log-' + i" v-for="(log, i) in $logic.log">
        <input style="width: 100%" :value="log" readonly>
      </div>
    </div>
    <iframe
      v-if="$logic.load === 100"
      style="border: none; width: 80%; height: 100%"
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
