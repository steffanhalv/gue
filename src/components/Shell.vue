<template>
  <div style="position: relative; width: 100%; height: 100%">
    <window
      v-for="w in windows"
      :id="w.id"
      :key="w.id"
      :resize="child ? res : resize"
      :update="update"
      :position="w.pos"
      :links="w.hooks"
      :width="w.width"
      :height="w.height"
      @resize="!child ? resize++ : $emit('resize')"
      @update="update = $event"
    >
      <span v-if="w.id !== 'preview'">{{ w.id }}</span>
      <shell
        :child="true"
        :res="child ? res : resize"
        @resize="!child ? resize++ : $emit('resize')"
        v-else
        :windows="wins"
      />
    </window>
  </div>
</template>
<script>
import Window from '@/components/Window'
import wins from '@/models/test'
export default {
  name: 'shell',
  props: ['windows', 'res', 'child'],
  components: {
    Window
  },
  data() {
    return {
      resize: 0,
      update: null,
      wins
    }
  },
  created() {
    if (!this.child) {
      window.onresize = () => {
        this.resize++
      }
    }
  }
}
</script>

<style scoped></style>
