export default (raw = '') => {
  // Convert raw text to array, divided by text & elements
  let arr = []
  let text = ''
  let isTag = false
  let isStartTag = false
  let isEndTag = false
  let isSingleQuote = false
  let isDoubleQuote = false
  let isEscape = false
  let noEndTags = [
    'area',
    'base',
    'col',
    'command',
    'embed',
    'keygen',
    'link',
    'param',
    'source',
    'track',
    'wbr',
    'input',
    'img',
    'br',
    'hr',
    'meta'
  ]
  for (var i = 0; i < raw.length; i++) {
    let char = raw.charAt(i)
    if (char === '<' && !(isSingleQuote || isDoubleQuote)) {
      if (text && !isTag)
        arr.push({
          children: false,
          text: text,
          end: true,
          tag: false
        })
      text = char
      isTag = true
    } else if (char === '/' && !(isSingleQuote || isDoubleQuote)) {
      if (isTag) isEndTag = true
      text += char
    } else if (char === '>' && !(isSingleQuote || isDoubleQuote)) {
      if (isTag) {
        text += char
        if (!isStartTag) {
          if (!isEndTag) {
            isStartTag = true
          }
          arr.push({
            children: isStartTag,
            text: text,
            end: isEndTag,
            tag: true
          })
        } else {
          arr.push({
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
    } else if (char === "'" && !isEscape) {
      if (isTag) isSingleQuote = !isSingleQuote
      text += char
    } else if (char === '"' && !isEscape) {
      if (isTag) isDoubleQuote = !isDoubleQuote
      text += char
    } else {
      text += char
    }
    if (isTag && !isSingleQuote && !isSingleQuote) {
      let tag = text
        .replace(/ /g, '')
        .toLowerCase()
        .replace('<', '')
      if (noEndTags.includes(tag)) {
        isEndTag = true
      }
    }
    if (char === '\\' && !isEscape) {
      if (isSingleQuote || isDoubleQuote) isEscape = true
    } else {
      isEscape = false
    }
  }

  // Convert array to vdom object
  let appendChildren = nodes => {
    let arr1 = []
    let arr2 = []
    let start = []
    nodes.forEach(node => {
      if (!start.length) {
        if (node.tag && node.children && !node.end) {
          start.push(node.text)
        } else {
          arr1.push({
            tag: node.tag,
            start: node.text,
            children: [],
            end: ''
          })
        }
      } else if (!node.tag || !node.end || (node.children && !node.end)) {
        if (node.tag && node.children && !node.end) {
          start.push(node.text)
        }
        arr2.push(node)
      } else {
        let match = node.text
          .replace('/', '')
          .replace('>', '')
          .replace(/ /g, '')
        if (
          start[start.length - 1].indexOf(match + ' ') === 0 ||
          start[start.length - 1].indexOf(match + '>') === 0
        ) {
          if (start.length === 1) {
            arr1.push({
              tag: true,
              start: start[0],
              children: appendChildren(arr2),
              end: node.text
            })
            arr2 = []
          } else {
            arr2.push(node)
          }
          start.pop()
        } else {
          arr2.push(node)
        }
      }
    })
    return arr1
  }
  return appendChildren(arr)
}
