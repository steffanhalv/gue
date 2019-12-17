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
      <layers
        @hovering="hovering = $event"
        @selected="selected = $event"
        :current="selected"
        :next="hovering"
        v-else-if="win.id === 'layers'"
      />
      <styles v-else-if="win.id === 'styles'" :selected="selected" />
      <assets v-else-if="win.id === 'assets'" />
      <router v-else-if="win.id === 'router'" />
      <tools v-else-if="win.id === 'tools'" />
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
import Playground from '@/components/Playground'
import Console from '@/components/Console'
import Layers from '@/components/Layers'
import Styles from '@/components/Styles'
import Assets from '@/components/Assets'
import Router from '@/components/Router'
import Tools from '@/components/Tools'
export default {
  name: 'shell',
  props: ['windows', 'res', 'mov', 'child'],
  components: {
    Window,
    Playground,
    Console,
    Layers,
    Styles,
    Assets,
    Router,
    Tools
  },
  data() {
    return {
      resize: 0,
      update: null,
      move: null,
      drop: null,
      hovering: '',
      selected: ''
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
