<template>
  <div>
    {{ store.current }}
    <br><br>
    <component v-if="comp" :is="comp"></component>
    <component :is="'style'" v-html="style"></component>
  </div>
</template>

<script>
import fs from 'fs'
export default {
  data() {
    return {
      comp: null,
      style: ''
    }
  },
  created() {
    setInterval(() => {
      let file = fs.readFileSync(this.store.current.path + '/test.vue', { encoding: 'utf8' })
      if (file !== this.file) {
        this.file = file
        this.parseVue()
      }
    }, 1000)
  },
  mounted() {
    this.file = fs.readFileSync(this.store.current.path + '/test.vue', { encoding: 'utf8' })
    this.parseVue()
  },
  methods: {
    parseVue() {
      let template = this.file.substring(
        this.file.indexOf('<template>') + '<template>'.length,
        this.file.indexOf('</template>')
      )
      let script = this.file.substring(
        this.file.indexOf('<script>') + '<script>'.length,
        this.file.indexOf('<' + '/script>')
      )
      let style = this.file.substring(
        this.file.indexOf('<style scoped>') + '<style scoped>'.length,
        this.file.indexOf('</style>')
      )
      script = script.replace('export default', 'script =')
      script = script.replace('module.exports', 'script =')
      eval(script)
      let comp = script
      comp.template = template
      this.comp = comp
      this.style = style
    }
  }
}
</script>