<template>
  <div class="timeline" v-if="data" @click="data.animations.logo.current.width = '30%'">
    <div
      style="position: relative; height: 20px;"
      :key="key"
      v-for="(ani, key) in data.animations">
      <div
        style="position: absolute; height: 100%; background: black"
        :style="{
          left: ani.motion[0].index + 'px',
          width: ani.motion[(ani.motion.length - 1)].index - ani.motion[0].index + 'px'
        }"
        v-if="ani.motion.length">
        <div
          style="position: absolute; height: 100%; background: blue"
          :style="{
            left: m.index - ani.motion[0].index + 'px'
          }"
          :key="k"
          v-for="(m, k) in ani.motion">
          {{m.index}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  watch: {
    'data': {
      deep: true,
      handler() {
        this.$emit('update', this.data)
        console.log('change')
      }
    }
  }
}
</script>

<style scoped>
.timeline {
  height: 100%;
  position: relative;
  overflow: auto;
}
</style>