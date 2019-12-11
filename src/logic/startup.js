import Vue from 'vue'
import vdom from '@/logic/vdom'
import fs from 'fs'
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
      vdom: '',
      log: []
    }
  },
  created() {
    let content = fs.readFileSync(this.path + 'src/App.vue', {
      encoding: 'utf8'
    })
    this.vdom = vdom.parse(content)
    console.log('vdom', this.vdom)
    let raw = vdom.stringify(this.vdom)
    vdom.each(this.vdom, node => {
      vdom.attrFromTag(node)
    })
    console.log(raw)
    fs.writeFileSync(this.path + 'src/App.vue', raw, {
      encoding: 'utf8',
      flag: 'w'
    })
    this.fix()
    this.serve()
  },
  methods: {
    unloadLog() {
      this.log = this.log.slice(0, 6)
    },
    fix() {
      let ls = spawn('cd ' + this.path + '; npm run lint -- --fix', [], {
        shell: true
      })
      ls.stdout.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        this.unloadLog()
      })
      ls.stderr.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        this.unloadLog()
      })
      ls.on('close', code => {
        this.log.unshift(`child process exited with code ${code}`)
        this.unloadLog()
      })
    },
    serve() {
      this.serving = true
      this.server = spawn('cd ' + this.path + '; npm run serve', [], {
        shell: true
      })
      this.server.stdout.on('data', data => {
        data = data.toString()
        this.log.unshift(data)
        this.unloadLog()
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
        this.unloadLog()
        if (data.indexOf('%') !== -1) {
          data = Number(data.split('%')[0].replace(/\s/g, ''))
          if (data > this.load) {
            this.load = data
          }
        }
      })
      this.server.on('close', code => {
        this.log.unshift(`child process exited with code ${code}`)
        this.unloadLog()
        this.serving = false
      })
    }
  }
})
