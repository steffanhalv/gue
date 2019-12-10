import fs from 'fs'

// Add data-gid="" to all elements
export default (path = '', index = 0) => {
  let content = fs.readFileSync(path, { encoding: 'utf8' })
  // let dom = document.createElement('html')

  let vdom = []
  let text = ''
  let isTag = false
  let isStartTag = false
  let isEndTag = false
  let isSingleQuote = false
  let isDoubleQuote = false
  let isEscape = false
  for (var i = 0; i < content.length; i++) {
    let char = content.charAt(i)
    // If start
    if (char === '<' && !(isSingleQuote || isDoubleQuote)) {
      if (text && !isTag) vdom.push({
        children: false,
        text: text,
        end: true,
        tag: false
      })
      text = char
      isTag = true
    // If potential end tag
    } else if (char === '/' && !(isSingleQuote || isDoubleQuote)) {
      if (isTag) isEndTag = true
      text += char
    // If closure
    } else if (char === '>' && !(isSingleQuote || isDoubleQuote)) {
      if (isTag) {
        text += char
        // start is defined
        if (!isStartTag) {
          if (!isEndTag) {
            isStartTag = true
          }
          vdom.push({
            children: isStartTag,
            text: text,
            end: isEndTag,
            tag: true
          })
        // start is not defined
        } else {
          vdom.push({
            children: isStartTag,
            text: text,
            end: isEndTag,
            tag: true
          })
          isStartTag = false
        }
        text = ''
        isEndTag = false
        isTag = false
      } else {
        text += char
      }
    } else if (char === '\'' && !isEscape) {
      if (isTag) isSingleQuote = !isSingleQuote
      text += char
    } else if (char === '"' && !isEscape) {
      if (isTag) isDoubleQuote = !isDoubleQuote
      text += char
    } else {
      text += char
    }
    // Set isEndTag for specials
    if (isTag && !isSingleQuote && !isSingleQuote) {
      let tag = text.replace(/ /g, '').toLowerCase().replace('<', '')
      if ([
        'img',
        'br'
      ].includes(tag)) {
        isEndTag = true
      }
    }
    // Toggle escape
    if (char === '\\' && !isEscape) {
      if ((isSingleQuote || isDoubleQuote)) isEscape = true
    } else {
      isEscape = false
    }
  }

  let template = false
  let temp = []
  vdom.forEach(lvl => {
    if (
      lvl.tag && lvl.text.replace(/ /g, '').toLowerCase().indexOf('<template ') === 0 ||
      lvl.tag && lvl.text.replace(/ /g, '').toLowerCase().indexOf('<template>') === 0
    ) {
      template = true
    }
    if (template) {
      temp.push(lvl)
    }
    if (lvl.tag && lvl.text.replace(/ /g, '').toLowerCase().indexOf('</template>') === 0) {
      template = false
    }
  })

  // @todo - nest this
  console.log(temp)
  /*
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
  */
  template = vdom
  return {
    template,
    index
  }
}
