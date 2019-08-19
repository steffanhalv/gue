<template>
  <div>
    <h1>This is an about page</h1>
    <button @click="store.projects.push({ path: 'hey' })">Push</button>
    <button @click="store.projects.pop()">Pop</button>
    {{ store.projects }}
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>