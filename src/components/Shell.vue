<template>
  <div style="position: relative; width: 100%; height: 100%">
    <window
      v-for="(win, i) in windows"
      :key="win.id"
      :position="win.pos"
      :resize="child ? res : resize"
      :update="update"
      :move="child ? mov : move"
      :drop="drop"
      :parent="windows"
      :me="win"
      @move="
        $event === 'self'
          ? ($emit('move', win), (move = win))
          : ($emit('move', $event), (move = $event))
      "
      @drop="
        $event === 'self'
          ? ($emit('drop', win), (drop = win))
          : ($emit('drop', $event), (drop = $event))
      "
      @resize="!child ? resize++ : $emit('resize')"
      @update="update = $event"
      @remove="windows.splice(i, 1)"
    >
      <playground style="height: 100%" v-if="win.id === 'playground'" />
      <console v-else-if="win.id === 'console'" />
      <span
        v-else
        style="display: inline-block; padding: 20px; color: #999; font-size: .9em"
        >Content</span
      >
    </window>
  </div>
</template>
<script>
import Playground from '@/components/Playground'
import Console from '@/components/Console'
import Window from '@/components/Window'
export default {
  name: 'shell',
  props: ['windows', 'res', 'mov', 'child'],
  components: {
    Window,
    Playground,
    Console
  },
  data() {
    return {
      resize: 0,
      update: null,
      move: null,
      drop: null
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
