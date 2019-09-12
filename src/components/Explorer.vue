<template>
  <div class="files">
    <label>Files & folders</label>
    <div v-if="store.current && store.current.files">
      <div
        :key="i"
        v-for="(file, i) in store.current.files"
        @click="store.current.file = file"
      >
        {{ file }}
      </div>
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

<style scoped>
label {
  border-top: 5px solid #4c4c4c;
  color: #eee;
  padding: 4px;
  display: inline-block;
  width: 100%;
}
.files {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: #555;
}
.files > div > div {
  display: inline-block;
  padding: 2px 5px;
  color: #eee;
  background-color: #444;
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid #3b3b3b;
}
.files > div > div:hover {
  color: #c5c5c5;
  background-color: #333;
}
</style>
