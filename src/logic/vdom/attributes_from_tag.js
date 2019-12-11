export default tag => {
  let arr = []
  if (typeof tag.start === 'string' && tag.tag) {
    let raw = tag.start.slice(1, -1)
    while (raw[raw.length - 1] === ' ' || raw[raw.length - 1] === '/') {
      raw = raw.slice(0, -1)
    }

    // Convert raw text to array, divided by spaces (treats multispaces as one and escape quotes)
    let text = ''
    let isSingleQuote = false
    let isDoubleQuote = false
    let isEscape = false
    for (var i = 0; i < raw.length; i++) {
      let char = raw.charAt(i)
      if (char === ' ' && !(isSingleQuote || isDoubleQuote)) {
        if (text) arr.push(text)
        text = ''
      } else if (char === "'" && !isEscape) {
        isSingleQuote = !isSingleQuote
        text += char
      } else if (char === '"' && !isEscape) {
        isDoubleQuote = !isDoubleQuote
        text += char
      } else {
        text += char
      }
      if (char === '\\' && !isEscape) {
        if (isSingleQuote || isDoubleQuote) isEscape = true
      } else {
        isEscape = false
      }
    }
    arr.push(text)
  }

  console.log(arr)

  return arr
}
