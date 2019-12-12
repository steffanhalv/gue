<template>
  <div id="app">
    <window
      @resize="resize++"
      :resize="resize"
      id="tools"
      :pos="{
        top: 0,
        right: 'calc(100% - 100px)',
        bottom: '#timeline',
        left: 0
      }"
      >Tools</window
    >
    <window
      @resize="resize++"
      :resize="resize"
      id="playground"
      width="300px"
      :pos="{ top: 0, right: '#preview', bottom: '#timeline', left: '#tools' }"
      >Playground</window
    >
    <window
      @resize="resize++"
      :resize="resize"
      id="preview"
      :pos="{
        top: 0,
        right: '300px',
        bottom: '#timeline',
        left: '#playground'
      }"
      >Preview</window
    >
    <window
      @resize="resize++"
      :resize="resize"
      id="styles"
      :pos="{ top: 0, right: 0, bottom: '#layers', left: '#preview' }"
      >Styles</window
    >
    <window
      @resize="resize++"
      :resize="resize"
      id="layers"
      :pos="{
        top: 'calc(100% - 400px)',
        right: 0,
        bottom: '#timeline',
        left: '#preview'
      }"
      >Layers</window
    >
    <window
      @resize="resize++"
      :resize="resize"
      id="timeline"
      :pos="{ top: 'calc(100% - 200px)', right: 0, bottom: 0, left: 0 }"
      >Timeline</window
    >
  </div>
</template>

<script>
import Window from '@/components/Window'
export default {
  components: {
    Window
  },
  data() {
    return {
      resize: 0
    }
  },
  created() {
    window.onresize = () => {
      this.resize++
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden !important;
  min-height: 0 !important;
  width: 100%;
  height: 100%;
  position: absolute;
}
body {
  margin: 0;
}
</style>
