export default (arr) => {
  let appendChildren = nodes => {
    let arr1 = []
    let arr2 = []
    let start = ''
    nodes.forEach(node => {
      if (!start) {
        if (node.tag && node.children && !node.end) {
          start = node.text
        } else {
          arr1.push(node.text)
        }
      } else if (!node.tag || !node.end || (node.children && !node.end)) {
        arr2.push(node)
      } else {
        let match = node.text
          .replace('/', '')
          .replace('>', '')
          .replace(/ /g, '')
        if (
          start.indexOf(match + ' ') === 0 ||
          start.indexOf(match + '>') === 0
        ) {
          arr1.push({
            start: start,
            children: appendChildren(arr2),
            end: node.text
          })
          start = ''
          arr2 = []
        } else {
          arr2.push(node)
        }
      }
    })
    return arr1
  }
  return appendChildren(arr)
}
