<template>
  <component
    v-if="motion"
    style="position: absolute"
    :is="tag"
    :key="motion.key + '-' + motion.progress"
    :style="motion.current">
    <slot/>
  </component>
</template>

<script>
export default {
  props: ['motion', 'tag']
}
</script>
