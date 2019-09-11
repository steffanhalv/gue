<template>
  <div>
    <label>DOM</label>
    <node @select="$emit('select', $event)" :node="node"/>
  </div>
</template>

<script>
import Node from '@/components/Node'
export default {
  props: ['template'],
  components: { Node },
  data() {
    return {
      node: null
    }
  },
  watch: {
    template: {
      deep: true,
      handler() {
        let dom = document.createElement('html')
        dom.innerHTML = this.template
        this.node = dom.querySelector('body')
      }
    }
  },
  mounted() {
    let dom = document.createElement('html')
    dom.innerHTML = this.template
    this.node = dom.querySelector('body')
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
</style>
