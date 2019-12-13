<template>
  <div style="position: relative; width: 100%; height: 100%">
    <window
      v-for="(w, i) in windows"
      :id="w.id"
      :key="w.id"
      :resize="child ? res : resize"
      :update="update"
      :position="w.pos"
      :links="w.hooks"
      :width="w.width"
      :height="w.height"
      :move="child ? mov : move"
      :drop="drop"
      :parent="windows"
      @move="
        $event === 'self'
          ? ($emit('move', w), (move = w))
          : ($emit('move', $event), (move = $event))
      "
      @drop="
        $event === 'self'
          ? ($emit('drop', w), (drop = w))
          : ($emit('drop', $event), (drop = $event))
      "
      @resize="!child ? resize++ : $emit('resize')"
      @update="update = $event"
      @remove="windows.splice(i, 1)"
    >
      <shell
        :child="true"
        :res="child ? res : resize"
        :mov="child ? mov : move"
        @move="!child ? (move = $event) : $emit('move', $event)"
        @resize="!child ? resize++ : $emit('resize')"
        v-if="w.id === 'preview'"
        :windows="wins"
      />
      <shell
        :child="true"
        :res="child ? res : resize"
        @resize="!child ? resize++ : $emit('resize')"
        v-else-if="w.id === 'preview2'"
        :windows="wins2"
      />
      <span
        v-else
        style="display: inline-block; padding: 20px; color: #999; font-size: .9em"
        >Content</span
      >
    </window>
  </div>
</template>
<script>
import Window from '@/components/Window'
import wins from '@/models/test'
import wins2 from '@/models/test2'
export default {
  name: 'shell',
  props: ['windows', 'res', 'mov', 'child'],
  components: {
    Window
  },
  data() {
    return {
      resize: 0,
      update: null,
      move: null,
      drop: null,
      wins,
      wins2
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
