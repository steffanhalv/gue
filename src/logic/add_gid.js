import fs from 'fs'

// Add data-gid="" to all elements
export default (path = '', index = 0) => {
  let content = fs.readFileSync(path, { encoding: 'utf8' })
  let dom = document.createElement('html')
  dom.innerHTML = content

  let templateContainer = dom.querySelector('head > template')
  let template = templateContainer.innerHTML

  let t = document.createElement('html')
  t.innerHTML = template
  t = t.getElementsByTagName('body')[0]

  let tags = t.getElementsByTagName('*')
  Array.prototype.slice.call(tags).forEach(node => {
    node.setAttribute('data-gid', index++)
  })

  template = t.innerHTML

  return {
    template,
    index
  }
}
