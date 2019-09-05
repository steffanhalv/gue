import beautify from 'js-beautify'
import tosource from 'tosource'
import fs from 'fs'
export default (path = '') => {
  // Convert obj to string
  let convert = obj => {
    return tosource(obj)
  }
  var loadVue = (path, main = false) => {
    // Get content
    let content = fs.readFileSync(path, { encoding: 'utf8' })
    let filename = path
      .split('\\')
      .pop()
      .split('/')
      .pop()
    path = path.replace('/' + filename, '')
    let root = path.substring(0, path.indexOf('/src')) + '/src' // @todo - set from src
    if (content) {
      let styles = []
      //// Get document
      let dom = document.createElement('html')
      dom.innerHTML = content

      //// Get template
      let templateContainer = dom.querySelector('head > template')
      let template = templateContainer.innerHTML
      template = template.replace(/require\('@/g, '~@')
      template = template.replace(/\.jpg'\)/g, '.jpg')
      template = template.replace(/\.png'\)/g, '.png')
      template = template.replace(/\.svg'\)/g, '.svg')
      if (main) {
        let t = document.createElement('html')
        t.innerHTML = template
        t = t.getElementsByTagName('body')[0]
        let tags = t.getElementsByTagName('*')
        Array.prototype.slice.call(tags).forEach(node => {
          let obj = {}
          Array.from(node.attributes).forEach(attr => {
            obj[attr.name] = attr.value
          })
          if (node.hasAttribute('@click')) {
            node.setAttribute('click-disabled', node.getAttribute('@click'))
            node.removeAttribute('@click')
          }
          node.setAttribute('click----enabled', 'select_in_gue')
          node.setAttribute('data-original', JSON.stringify(obj))
        })
        let beautyHtml = beautify.html(t.innerHTML, {
          indent_size: 2,
          space_in_empty_paren: true
        })
        template = beautyHtml.replace(/click----enabled/g, '@click')
      }
      template = template.replace(/~@/g, "'file://" + path)
      template = template.replace(/url\(' \+ 'file/g, 'url(file')
      template = template.replace(/ \+ '\)/g, ')')
      template = template.replace(/\.jpg"/g, '.jpg\'"')
      template = template.replace(/\.png"/g, '.png\'"')
      template = template.replace(/\.svg"/g, '.svg\'"')

      //// Get component
      let componentContainer = dom.querySelector('head > script')
      let component = componentContainer.innerHTML
      component = component.replace('export default', 'component =')
      component = component.replace('module.exports', 'component =')
      component = require('@babel/core').transform(component, {
        presets: [require('@babel/preset-env')],
        root: path
      }).code
      component = component.replace(/(require\(".*?"\))/g, match => {
        match = match.replace('require("', '')
        match = match.substring(0, match.length - 2)
        let ext = match.split('.').pop()
        if (match.substring(0, 1) === '@') {
          if (
            ext === 'vue' &&
            fs.existsSync(root + match.substring(1)) &&
            fs.lstatSync(root + match.substring(1)).isFile()
          ) {
            let comp = loadVue(root + match.substring(1))
            styles = styles.concat(comp.styles)
            return convert(comp.component)
          } else if (
            fs.existsSync(root + match.substring(1)) &&
            fs.lstatSync(root + match.substring(1)).isFile()
          ) {
            return 'require("' + root + match.substring(1) + '")'
          } else if (
            fs.existsSync(root + match.substring(1) + '.vue') &&
            fs.lstatSync(root + match.substring(1) + '.vue').isFile()
          ) {
            let comp = loadVue(root + match.substring(1) + '.vue')
            styles = styles.concat(comp.styles)
            return convert(comp.component)
          } else if (
            fs.existsSync(root + match.substring(1) + '.js') &&
            fs.lstatSync(root + match.substring(1) + '.js').isFile()
          ) {
            return 'require("' + root + match.substring(1) + '.js' + '")'
          } else if (
            fs.existsSync(root + match.substring(1) + '.json') &&
            fs.lstatSync(root + match.substring(1) + '.json').isFile()
          ) {
            return 'require("' + root + match.substring(1) + '.json' + '")'
          } else {
            return match
          }
        } else if (match.substring(0, 2) === './') {
          if (
            ext === 'vue' &&
            fs.existsSync(path + match.substring(2)) &&
            fs.lstatSync(path + match.substring(2)).isFile()
          ) {
            let comp = loadVue(path + match.substring(2))
            styles = styles.concat(comp.styles)
            return convert(comp.component)
          } else if (
            fs.existsSync(path + match.substring(2)) &&
            fs.lstatSync(path + match.substring(2)).isFile()
          ) {
            return 'require("' + path + match.substring(2) + '")'
          } else if (
            fs.existsSync(path + match.substring(2) + '.vue') &&
            fs.lstatSync(path + match.substring(2) + '.vue').isFile()
          ) {
            let comp = loadVue(path + match.substring(2) + '.vue')
            styles = styles.concat(comp.styles)
            return convert(comp.component)
          } else if (
            fs.existsSync(path + match.substring(2) + '.js') &&
            fs.lstatSync(path + match.substring(2) + '.js').isFile()
          ) {
            return 'require("' + path + match.substring(2) + '.js' + '")'
          } else if (
            fs.existsSync(path + match.substring(2) + '.json') &&
            fs.lstatSync(path + match.substring(2) + '.json').isFile()
          ) {
            return 'require("' + path + match.substring(2) + '.json' + '")'
          } else {
            return match
          }
        } else if (match.substring(0, 3) === '../') {
          if (
            ext === 'vue' &&
            fs.existsSync(path + '/' + match) &&
            fs.lstatSync(path + '/' + match).isFile()
          ) {
            let comp = loadVue(path + '/' + match)
            styles = styles.concat(comp.styles)
            return convert(comp.component)
          } else if (
            fs.existsSync(path + '/' + match) &&
            fs.lstatSync(path + '/' + match).isFile()
          ) {
            return 'require("' + path + '/' + match + '")'
          } else if (
            fs.existsSync(path + '/' + match + '.vue') &&
            fs.lstatSync(path + '/' + match + '.vue').isFile()
          ) {
            let comp = loadVue(path + '/' + match + '.vue')
            styles = styles.concat(comp.styles)
            return convert(comp.component)
          } else if (
            fs.existsSync(path + '/' + match + '.js') &&
            fs.lstatSync(path + '/' + match + '.js').isFile()
          ) {
            return 'require("' + path + '/' + match + '.js' + '")'
          } else if (
            fs.existsSync(path + '/' + match + '.json') &&
            fs.lstatSync(path + '/' + match + '.json').isFile()
          ) {
            return 'require("' + path + '/' + match + '.json' + '")'
          } else {
            return match
          }
        } else {
          return (
            'require("' + root + '/../node_modules/' + match.substring(1) + '")'
          )
        }
      })
      eval(component)
      if (!component.methods) component.methods = {}
      /* eslint-disable */
      if (main) {
        component.methods.select_in_gue = (e) => {
          eval('this.$emit(\'select_in_gue\', e)')
        }
      }
      /* eslint-enable */
      component.template = template

      //// Get styles
      let styleContainer = dom.querySelectorAll('head > style')
      Array.prototype.slice.call(styleContainer).forEach(style => {
        styles.push(style.innerHTML)
      })
      return {
        component,
        styles
      }
    } else {
      return {
        component: {},
        styles: []
      }
    }
  }
  return loadVue(path, true)
}
