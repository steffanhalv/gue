<template>
  <ul v-if="node">
    <li v-if="children.length">
      <span :class="current(node.dataset.identifier) ? 'current' : ''" @click="$emit('select', node)" v-if="node.tagName !== 'BODY'">
      {{ node.tagName }} {{ node.dataset.identifier }}
      </span>
      <node :element="element" @select="$emit('select', $event)" :node="child" v-for="(child, i) in children" :key="i"/>
    </li>
    <li v-else-if="node.tagName !== 'BODY'">
      <span :class="current(node.dataset.identifier) ? 'current' : ''" @click="$emit('select', node)">{{ node.tagName }} {{ node.dataset.identifier }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'node',
  props: ['node', 'element'],
  data() {
    return {
      children: []
    }
  },
  methods: {
    current(id) {
      if (this.element && typeof this.element !== 'undefined') {
        if (Number(this.element['data-identifier']) === Number(id)) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    node: {
      deep: true,
      handler() {
        if (this.node) {
          let dom = document.createElement('html')
          dom.innerHTML = this.node
          this.children = Array.prototype.slice.call(
            this.node.querySelectorAll(':scope > *')
          )
        }
      }
    }
  },
  mounted() {
    if (this.node) {
      let dom = document.createElement('html')
      dom.innerHTML = this.node
      this.children = Array.prototype.slice.call(
        this.node.querySelectorAll(':scope > *')
      )
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
ul {
  list-style-type: none; 
  margin: 0;
  padding: 0 0 0 15px;
  text-align: left;
  cursor: pointer;
}
li span:hover {
  color: white;
}
li span.current {
  color: rgb(205, 70, 144);
}
</style>
