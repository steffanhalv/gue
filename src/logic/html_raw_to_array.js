export default (content = '') => {
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
  for (var i = 0; i < content.length; i++) {
    let char = content.charAt(i)
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
  return arr
}
