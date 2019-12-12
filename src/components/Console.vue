<template>
  <div class="console">
    <div :key="'log-' + i" v-for="(log, i) in $server.log">
      <span
        style="font-family: monospace; display: inline-block; text-align: left; white-space: nowrap; width: 100%"
      >
        {{ '$: ' + log }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style></style>
