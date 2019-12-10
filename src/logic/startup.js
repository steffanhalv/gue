import Vue from 'vue'
import gid from '@/logic/add_gid'
import { spawn } from 'child_process'

export default new Vue({
  data() {
    return {
      serving: false,
      server: null,
      path: '/Users/steffan/Desktop/git/gue/example/',
      local: '',
      network: '',
      load: 0,
      template: '',
      log: []
    }
  },
  created() {
    this.template = gid(this.path + 'src/App.vue')
    this.serve()
    console.log('well')
  },
  methods: {
    serve() {
      this.serving = true
      this.server = spawn('cd ' + this.path + '; npm run serve', [], {
        shell: true
      })
      this.server.stdout.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        if (data.indexOf('Local:' !== -1)) {
          data = data.split('Local:')[1]
          if (data && data.indexOf('- Network: ' !== -1)) {
            data = data.split('- Network: ')
            this.local = data[0].replace(/\s/g, '')
            if (typeof data[1] !== 'undefined')
              this.network = data[1].split(' ')[0].replace(/\s/g, '')
            this.load = 100
          }
        }
      })
      this.server.stderr.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        if (data.indexOf('%') !== -1) {
          data = Number(data.split('%')[0].replace(/\s/g, ''))
          if (data > this.load) {
            this.load = data
          }
        }
      })
      this.server.on('close', code => {
        this.log.unshift(`child process exited with code ${code}`)
        this.serving = false
      })
    }
  }
})
