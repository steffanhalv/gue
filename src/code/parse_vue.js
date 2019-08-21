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
    component.template = template
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