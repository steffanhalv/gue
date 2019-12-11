export default (arr, attr) => {
  let update = []
  let found = false
  let match1 = attr
  if (match1.indexOf('=') !== -1) {
    match1 = match1.split('=')[0]
  }
  arr.forEach(att => {
    let match2 = att
    if (match2.indexOf('=') !== -1) {
      match2 = match2.split('=')[0]
    }
    if (match2 === match1) {
      found = true
      update.push(attr)
    } else {
      update.push(att)
    }
  })
  if (!found) {
    update.splice(1, 0, attr)
  }
  return update
}
