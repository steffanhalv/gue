export default keypoints => {
  if (!keypoints.motion.length) return keypoints.current
  keypoints.motion.sort((a, b) =>
    Number(a.index) > Number(b.index)
      ? 1
      : Number(b.index) > Number(a.index)
      ? -1
      : 0
  )
  if (
    keypoints.motion.length === 1 ||
    keypoints.motion[0].index > keypoints.progress
  ) {
    keypoints.current = Object.assign(
      keypoints.current,
      keypoints.motion[0].style
    )
    return keypoints.current
  }
  if (
    keypoints.motion[keypoints.motion.length - 1].index < keypoints.progress
  ) {
    keypoints.current = Object.assign(
      keypoints.current,
      keypoints.motion[keypoints.motion.length - 1].style
    )
    return keypoints.current
  }
  let i = 0
  keypoints.motion.forEach(point => {
    if (i < keypoints.motion.length - 1) {
      if (
        point.index <= keypoints.progress &&
        keypoints.motion[i + 1].index >= keypoints.progress
      ) {
        const start = point
        const end = keypoints.motion[i + 1]
        const duration = end.index - start.index
        const progress = keypoints.progress - start.index
        let percentage = progress / duration
        if (percentage < 0) percentage = 0
        else if (percentage > 1) percentage = 1
        Object.keys(start.style).forEach(key => {
          // hex to rgb colors start
          if (start.style[key].toString().split('')[0] === '#') {
            const hex = start.style[key].replace(
              /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
              (m, r, g, b) => r + r + g + g + b + b
            )
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            if (result)
              start.style[key] = 'rgb('
                .concat(parseInt(result[1], 16), ', ')
                .concat(parseInt(result[2], 16), ', ')
                .concat(parseInt(result[3], 16), ')')
          } // hex to rgb colors end
          if (end.style[key].toString().split('')[0] === '#') {
            const _hex = end.style[key].replace(
              /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
              (m, r, g, b) => r + r + g + g + b + b
            )
            const _result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
              _hex
            )
            if (_result)
              end.style[key] = 'rgb('
                .concat(parseInt(_result[1], 16), ', ')
                .concat(parseInt(_result[2], 16), ', ')
                .concat(parseInt(_result[3], 16), ')')
          } // Split start into numeric and string groups
          let charsStart = []
          const numsStart = []
          let prevN = false
          let val = ''
          const startval = start.style[key].toString().split('')
          startval.forEach(c => {
            if (c !== '.' && isNaN(parseInt(c))) {
              if (prevN) {
                if (val !== '') numsStart.push(val)
                val = c
              } else val += c
              prevN = false
            } else {
              if (!prevN) {
                if (val !== '') charsStart.push(val)
                val = c
              } else val += c
              prevN = true
            }
          })
          if (val !== '.' && isNaN(parseInt(val)) && val !== '')
            charsStart.push(val)
          else numsStart.push(val) // Split end into numeric and string groups
          const charsEnd = []
          const numsEnd = []
          prevN = false
          val = ''
          end.style[key]
            .toString()
            .split('')
            .forEach(c => {
              if (c !== '.' && isNaN(parseInt(c))) {
                if (prevN) {
                  if (val !== '') numsEnd.push(val)
                  val = c
                } else val += c
                prevN = false
              } else {
                if (!prevN) {
                  if (val !== '') charsEnd.push(val)
                  val = c
                } else val += c
                prevN = true
              }
            })
          if (val !== '.' && isNaN(parseInt(val)) && val !== '')
            charsEnd.push(val)
          else numsEnd.push(val)
          if (charsEnd.length > charsStart.length) charsStart = charsEnd // Calc current value
          const numsCalced = []
          numsStart.forEach((start, i) => {
            const end = numsEnd[i]
            numsCalced.push(end - (end - start) * (1 - percentage))
          })
          val = ''
          if (startval.length) {
            if (startval[0] !== '.' && isNaN(parseInt(startval[0]))) {
              numsCalced.forEach((num, i) => {
                let c = ''
                if (typeof charsStart[i] !== 'undefined') c = charsStart[i]
                val += c + num
              })
              if (charsStart.length > numsCalced.length)
                val += charsStart[charsStart.length - 1]
            } else {
              numsCalced.forEach((num, i) => {
                let c = ''
                if (typeof charsStart[i] !== 'undefined') c = charsStart[i]
                val += num + c
              })
            }
          }
          keypoints.current[key] = val
        })
      }
    }
    i++
  })
  return keypoints.current
}

/*

Example.vue

<template>
<animation tag="img" :motion="animations['logo']" :src="require('@/assets/logo.svg')">
  Content
</animation>
</template>

import Animation from '@/components/Animation'
export default {
  components: { Animation },
  data () {
    return {
      animations: {
        logo: {
          current: {
            top: 'calc(5% - 0%)',
            width: '30%',
            left: 'calc(50% - 15%)',
            opacity: 1,
            zIndex: '1'
          },
          motion: [
            {
              index: 0,
              style: {
                top: 'calc(5% - 0%)',
                opacity: 1
              }
            },
            {
              index: 300,
              style: {
                top: 'calc(5% - 5%)',
                opacity: 1
              }
            },
            {
              index: 650,
              style: {
                top: 'calc(5% - 25%)',
                opacity: 0
              }
            }
          ],
          progress: 0
        }
      }
      progress: 0
    }
  },
  mounted () {
    document.addEventListener('scroll', e => {
      Object.keys(this.animations).forEach(key => {
        this.progress = e.target.scrollingElement.scrollTop
        this.animations[key].key = key
        this.animations[key].progress = e.target.scrollingElement.scrollTop
        this.animate(this.animations[key])
      })
    })
    document.getElementById('window').addEventListener('scroll', e => {
      Object.keys(this.animations).forEach(key => {
        this.progress = e.target.scrollTop
        this.animations[key].key = key
        this.animations[key].progress = e.target.scrollTop
        this.animate(this.animations[key])
      })
    })
  }
}
*/
