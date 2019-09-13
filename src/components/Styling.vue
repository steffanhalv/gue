<template>
  <div class="styles">
    <label v-if="selected && selected.motion">Timeline</label>
    <label
      style="cursor: pointer"
      @click="$emit('motion', selected), $emit('parent', parent)"
      v-else-if="selected && typeof selected.index !== 'undefined'">
      Keypoint {{ selected.index }}
    </label>
    <label v-else>Style</label>
    <div v-if="store.current" style="color: #eee">
      <div
        :key="key"
        v-for="(value, key) in style"
      >
        <span style="width: 50%; text-align: left; float: left; margin: 0">
          {{ key }}
        </span>
        <input
          style="width: calc(50% - 6px); float: right; margin: 0; border: 0; padding: 5px 3px;"
          v-model="style[key]" />
      </div>
      <div v-if="selected && typeof selected.index !== 'undefined'">
        <span style="width: 50%; text-align: left; float: left; margin: 0">
          Index
        </span>
        <input
          style="width: calc(50% - 6px); float: right; margin: 0; border: 0; padding: 5px 3px;"
          v-model="selected.index" />
      </div>
      <span v-if="selected && selected.motion">
        <styling
          @motion="$emit('motion', $event)"
          @parent="$emit('parent', $event)"
          :parent="selected"
          :selected="motion"
          :key="key"
          v-for="(motion, key) in selected.motion"/>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'styling',
  props: ['selected', 'parent'],
  data() {
    return {}
  },
  computed: {
    style() {
      if (this.selected && this.selected.style)
        return this.selected.style
      if (this.selected && this.selected.current)
        return this.selected.current
      return this.selected
    }
  }
}
</script>

<style scoped>
label {
  border-top: 5px solid #4c4c4c;
  color: #eee;
  padding: 4px;
  display: inline-block;
  width: 100%;
}
.styles {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: #555;
}
.styles > div > div {
  display: inline-block;
  padding: 2px 5px;
  color: #eee;
  background-color: #444;
  cursor: pointer;
  width: calc(100% - 8px);
  border-bottom: 1px solid #3b3b3b;
}
.styles > div > div:hover {
  color: #c5c5c5;
  background-color: #333;
}
.motion-select:hover {
  background-color: #333;
}
.motion-select {
  background-color: #444;
  cursor: pointer;
  width: calc(100% - 6px);
  padding: 3px;
  display: inline-block;
  text-align: left;
}
</style>
