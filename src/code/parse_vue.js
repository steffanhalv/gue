import beautify from 'js-beautify'
export default (file) => {
  if (file) {
    let template = file.substring(
      file.indexOf('<template>') + '<template>'.length,
      file.indexOf('</template>')
    )
    let component = file.substring(
      file.indexOf('<script>') + '<script>'.length,
      file.indexOf('<' + '/script>')
    )
    let style = file.substring(
      file.indexOf('<style scoped>') + '<style scoped>'.length,
      file.indexOf('</style>')
    )
    component = component.replace('export default', 'component =')
    component = component.replace('module.exports', 'component =')
    eval(component)
    if (!component.methods) component.methods = {}
    /* eslint-disable */
    component.methods.select_in_gue = (e) => {
      eval('this.$emit(\'select_in_gue\', e)')
    }
    /* eslint-enable */
    // Convert back
    let dom = document.createElement('html')
    dom.innerHTML = template
    dom = dom.getElementsByTagName('body')[0] // Skip html, head, body
    // Fix
    let tags = dom.getElementsByTagName('*')
    Array.prototype.slice.call( tags ).forEach(node => {
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
    // Convert back
    let beautyHtml = beautify.html(dom.innerHTML, { indent_size: 2, space_in_empty_paren: true })
    component.template = beautyHtml.replace(/click----enabled/g, '@click')
    return {
      component,
      style
    }
  } else {
    return {
      component: {},
      style: ''
    }
  }
}