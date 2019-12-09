<template>
  <div class="styles">
    <label>Attributes</label>
    <div v-if="store.current" style="color: #eee">
      <div :key="attribute" v-for="(value, attribute) in selected">
        <span style="width: 50%; text-align: left; float: left; margin: 0">
          {{ attribute }}
        </span>
        <input
          style="width: calc(50% - 6px); float: right; margin: 0; border: 0; padding: 5px 3px;"
          v-model="selected[attribute]"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selected'],
  data() {
    return {}
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
</style>
