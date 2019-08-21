<template>
  <div class="shell">
    <div class="topbar">
      {{ store.current.path }} | {{ store.current.file }}
    </div>
    <div v-if="file" class="playground">
      <component v-if="component" :is="component"></component>
      <component :is="'style'" v-html="style"></component>
    </div>
    <div class="toolbar">
      <styling class="toolbar__styling"/>
      <explorer class="toolbar__explorer"/>
    </div>
  </div>
</template>

<script>
import fs from 'fs'
import parser from '../code/parse_vue'
import Styling from '@/components/Styling'
import Explorer from '@/components/Explorer'
export default {
  components: {
    Styling,
    Explorer
  },
  data() {
    return {
      component: null,
      style: '',
      file: null
    }
  },
  created() {
    setInterval(() => {
      this.parseVue()
    }, 1000)
  },
  mounted() {
    this.parseVue()
    this.getFiles()
  },
  watch: {
    'store.current.path'() {
      this.getFiles()
    }
  },
  methods: {
    parseVue() {
      if (this.store.current && this.store.current.path && this.store.current.file) {
        let path = this.store.current.path + '/' + this.store.current.file
        let ext = this.store.current.file.split('.').pop()
        if (fs.existsSync(path) && fs.lstatSync(path).isFile() && ext === 'vue') {
          let file = fs.readFileSync(path, { encoding: 'utf8' })
          if (file !== this.file) {
            this.file = file
            let parsed = parser(file)
            this.component = parsed.component
            this.style = parsed.style
          }
        } else {
          this.file = null
        }
      } else {
        this.file = null
      }
    },
    getFiles() {
      if (this.store.current && this.store.current.path) {
        fs.readdir(this.store.current.path, (err, files) => {
          this.store.current.files = files
          this.store.current.file = files[0]
          this.file = null
        })
      }
    }
  }
}
</script>

<style scoped>
.shell {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.playground {
  float: left;
  width: calc(100% - 230px);
  height: calc(100% - 40px);
}
.toolbar {
  float: right;
  width: 230px;
  height: calc(100% - 40px);
}
.topbar {
  width: 100%;
  height: 40px;
}
.toolbar__styling {
  height: 60%;
}
.toolbar__explorer {
  height: 40%;
}
</style>