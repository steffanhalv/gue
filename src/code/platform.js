export default () => {
  let electron = typeof navigator === 'undefined'
  if (!electron) {
    let userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf(' electron/') > -1) {
      electron = true
    }
  }
  return {
    electron,
    web: !electron
  }
}