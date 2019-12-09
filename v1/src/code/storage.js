import Vue from 'vue'
import platform from './platform'

/**
 * This data will be reactive, shared between renderer & main processes & stored in localStorage
 * In main process: global.store
 * In renderer process: store or this.store
 */

// Add all global data here
let data = {
  current: null,
  projects: []
}

// Logic
let store
let reactiveData
let electron
if (platform().electron) {
  let Store = require('electron-store')
  let storage = new Store()
  electron = require('electron')
  store = {
    getItem(val) {
      return storage.get(val)
    },
    setItem(val1, val2) {
      return storage.set(val1, val2)
    }
  }
} else {
  store = localStorage
}
if (!(process && process.type && process.type === 'renderer')) {
  reactiveData = new Vue({
    data() {
      return data
    },
    created() {
      Object.keys(data).forEach(key => {
        this.getStorage(key)
        this.$watch(key, {
          deep: true,
          handler(val) {
            if (val) val = JSON.stringify(val)
            store.setItem(key, val)
            electron.webContents.getAllWebContents().forEach(wc => {
              wc.send('updated-' + key)
            })
          }
        })
      })
    },
    methods: {
      getStorage(slug) {
        let item = store.getItem(slug)
        if (!item) return []
        this[slug] = JSON.parse(store.getItem(slug))
      }
    }
  })
  global.store = reactiveData
} else {
  let globStore = electron.remote.getGlobal('store')
  reactiveData = new Vue({
    data() {
      return data
    },
    created() {
      Object.keys(data).forEach(key => {
        this.getStorage(key)
        this.$watch(key, {
          deep: true,
          handler() {
            globStore[key] = this[key]
          }
        })
        electron.ipcRenderer.on('updated-' + key, () => {
          this.getStorage(key)
        })
      })
    },
    methods: {
      getStorage(slug) {
        let item = store.getItem(slug)
        if (item) {
          let json = store.getItem(slug)
          if (!this[slug]) this[slug] = JSON.parse(json)
          else if (json !== JSON.stringify(this[slug])) {
            this[slug] = JSON.parse(store.getItem(slug))
          }
        } else {
          this[slug] = item
        }
      }
    }
  })
}
export default reactiveData
