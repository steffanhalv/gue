import Vue from 'vue'
import { spawn } from 'child_process'

export default new Vue({
  data() {
    return {
      root: '/Users/steffan/Desktop/git/gue/example/',
      local: '',
      network: '',
      load: 0,
      log: []
    }
  },
  created() {
    this.exec('cd ' + this.root + '; npm run lint -- --fix')
    if (this.load !== 100) this.exec('cd ' + this.root + '; npm run serve')
  },
  watch: {
    log() {
      if (this.log.length > 6) {
        this.log = this.log.slice(0, 6) // Reduce memory by shrinking
      }
    }
  },
  methods: {
    exec(cmd) {
      let ls = spawn(cmd, [], {
        shell: true
      })
      ls.stdout.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        if (this.load !== 100 && data.indexOf('Local:' !== -1)) {
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
      ls.stderr.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        if (this.load !== 100 && data.indexOf('%') !== -1) {
          data = Number(data.split('%')[0].replace(/\s/g, ''))
          if (data > this.load) {
            this.load = data
          }
        }
      })
      ls.on('close', code => {
        this.log.unshift(`child process exited with code ${code}`)
      })
    }
  }
})
