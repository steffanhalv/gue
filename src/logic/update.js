import fs from 'fs'

export default (path, template) => {
  let content = fs.readFileSync(path, { encoding: 'utf8' })

  let file = path
  let filename = path
    .split('\\')
    .pop()
    .split('/')
    .pop()
  path = path.replace('/' + filename, '')
 
  let dom = document.createElement('html')
  dom.innerHTML = content
  dom.querySelector('head > template').innerHTML = '\n' + template + '\n'

  fs.writeFileSync(file, dom.querySelector('head').innerHTML, {
    encoding: 'utf8',
    flag: 'w'
  })
}
