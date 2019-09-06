import tosource from 'tosource'
import fs from 'fs'
import beautify from 'js-beautify'
import { transform } from 'lebab'
import { Linter } from 'eslint'
import * as prettier from 'eslint-plugin-prettier'
import * as babel from 'babel-eslint'

export default (path, component, style) => {
  let content = fs.readFileSync(path, { encoding: 'utf8' })

  let file = path
  let filename = path
    .split('\\')
    .pop()
    .split('/')
    .pop()
  path = path.replace('/' + filename, '')
  // let root = path.substring(0, path.indexOf('/src')) + '/src' // @todo - set from src

  let obj = Object.assign({}, component)
  let template = obj.template
  delete obj.template
  delete obj._Ctor
  delete obj.methods.select_in_gue
  Object.keys(obj.components).forEach(key => {
    obj.components[key] = '!REMOVEME!'
  })

  //// Get template
  template = template.replace(/\.jpg'"\)/g, '.jpg" + \'')
  template = template.replace(/\.png'"\)/g, '.png" + \'')
  template = template.replace(/\.svg'"\)/g, '.svg" + \'')
  template = template.replace(/url\(file/g, "url(' + 'file")
  template = template.replace(new RegExp("'file://" + path, 'g'), '~@')

  let t = document.createElement('html')
  t.innerHTML = template
  t = t.getElementsByTagName('body')[0]
  let tags = t.getElementsByTagName('*')
  Array.prototype.slice.call(tags).forEach(node => {
    node.removeAttribute('@click')
    let oldAttributes = JSON.parse(node.getAttribute('data-original'))
    Object.keys(oldAttributes).forEach(attr => {
      if (attr.charAt(0) === '@') {
        node.setAttribute('gui-' + attr.substring(1), oldAttributes[attr])
        node.removeAttribute(attr)
      } else {
        node.setAttribute(attr, oldAttributes[attr])
      }
    })
    node.removeAttribute('data-original')
  })
  let beautyHtml = beautify.html(t.innerHTML, {
    indent_size: 2,
    space_in_empty_paren: true
  })
  template = beautyHtml.replace(/click-disabled/g, '@click')
  template = beautyHtml.replace(/gui-/g, '@')

  template = template.replace(/\.jpg'"/g, '.jpg\')"')
  template = template.replace(/\.png'"/g, '.png\')"')
  template = template.replace(/\.svg'"/g, '.svg\')"')
  template = template.replace(/\.jpg\)'"/g, ".jpg') + ')'\"")
  template = template.replace(/\.png\)'"/g, ".png') + ')'\"")
  template = template.replace(/\.svg\)'"/g, ".svg') + ')'\"")

  // template = template.replace(/require\('@/g, '~@')
  template = template.replace(/~@/g, "require('@")

  //// Get document
  let dom = document.createElement('html')
  dom.innerHTML = content

  dom.querySelector('head > template').innerHTML = '\n' + template + '\n'

  let prevContent = dom.querySelector('head > script').innerHTML
  let prepend = prevContent.substring(0, prevContent.indexOf('export default'))
  let source = tosource(obj)
  source = 'module.exports = ' + source
  source = source.replace(/: _.*?\["default"\]/g, '')
  source = source.replace(/:"!REMOVEME!"/g, '')

  const { code } = transform(source, [
    'let',
    'arrow',
    'arrow-return',
    'commonjs',
    'class',
    'template',
    'default-param',
    // 'destruct-param',
    'includes',
    'multi-var',
    'exponent',
    'no-strict',
    'obj-shorthand',
    'obj-method',
    'arg-spread',
    'arg-rest',
    'for-each',
    'for-of'
  ])
  source = code
  //source = source.replace()

  let linter = new Linter()
  linter.defineParser('babel-eslint', babel)
  linter.defineRule('prettier/prettier', prettier.rules.prettier)
  let results = linter.verifyAndFix(source, {
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'none'
        }
      ]
    },
    parser: 'babel-eslint'
  })
  source = results.output
  source = source.replace(/_this./g, 'this.')
  source = source.replace(/const this.= this\n/g, '')
  source = source.replace(/\n\n/g, '\n')

  dom.querySelector('head > script').innerHTML = prepend + source + '\n'
  dom.querySelector('head > style').innerHTML = style[0]

  fs.writeFileSync(file, dom.querySelector('head').innerHTML, {
    encoding: 'utf8',
    flag: 'w'
  })
}
