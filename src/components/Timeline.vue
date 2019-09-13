<template>
  <div class="timeline" v-if="data" @click="data.animations.logo.current.width = '30%'">
    <div
      :class="isCurrent(element, key, ani) ? 'current' : ''"
      class="sequence-line"
      :key="key"
      v-for="(ani, key) in data.animations">
      <div
        class="sequence"
        :style="{
          left: ani.motion[0].index + 'px',
          width: ani.motion[(ani.motion.length - 1)].index - ani.motion[0].index + 'px'
        }"
        v-if="ani.motion.length">
        <div @click="$emit('motion', ani), $emit('timeline', key), $emit('parent', null)" class="sequence-selector"></div>
        <div
          @click="$emit('motion', m), $emit('timeline', key), $emit('parent', ani)"
          class="keypoint"
          :style="{
            left: m.index - ani.motion[0].index + 'px'
          }"
          :key="k"
          v-for="(m, k) in ani.motion">
          {{m.index}}
        </div>
        <span class="sequence-key">{{ key }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'element'],
  methods: {
    isCurrent(attr, key, ani) {
      if (attr === 'animations[\'' + key + '\']') {
        this.$emit('motion', ani)
        this.$emit('timeline', key)
        this.$emit('parent', null)
        return true
      }
      return false
    }
  },
  watch: {
    'data': {
      deep: true,
      handler() {
        this.$emit('update', this.data)
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
.keypoint:hover {
  background: #115ad1
}
.keypoint {
  cursor: pointer;
  padding: 0 3px;
  position: absolute;
  background: #166fff;
  margin-top: 1px;
  font-size: .8em;
}
.sequence-line {
  position: relative;
  height: 20px;
  border-bottom: 1px solid #4c4c4c;
  width: 100%;
}
.sequence-line.current {
  background: #4c4c4c;
}
.sequence-key {
  color: white;
  float: left;
  font-size: .9em;
  padding: 1px 0 0 50px;
}
.sequence-line.current .sequence {
  background: rgb(205, 70, 144);
}
.sequence-selector {
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.sequence-selector:hover {
  background-color: rgba(255, 255, 255, .2)
}
.sequence {
  position: absolute;
  height: 100%;
  background: #187fe0;
}
</style>