<template>
  <div id="app">
    <window
      id="tools"
      @resize="resize++"
      :resize="resize"
      @update="update = $event"
      :update="update"
      :position="{
        top: 0,
        right: 'calc(100% - 100px)',
        bottom: '#timeline',
        left: 0
      }"
      :links="{
        top: '',
        right: '#playground',
        bottom: '#timeline',
        left: ''
      }"
      >Tools</window
    >
    <window
      id="playground"
      @resize="resize++"
      :resize="resize"
      @update="update = $event"
      :update="update"
      width="300px"
      :position="{ top: 0, right: '#preview', bottom: '#timeline', left: '#tools' }"
      :links="{
        top: '',
        right: '#preview',
        bottom: '#timeline',
        left: '#tools'
      }"
      >Playground</window
    >
    <window
      id="preview"
      @resize="resize++"
      :resize="resize"
      @update="update = $event"
      :update="update"
      :position="{
        top: 0,
        right: '300px',
        bottom: '#timeline',
        left: '#playground'
      }"
      :links="{
        top: '',
        right: '#styles',
        bottom: '#timeline',
        left: '#playground'
      }"
      >Preview</window
    >
    <window
      id="styles"
      @resize="resize++"
      :resize="resize"
      @update="update = $event"
      :update="update"
      :position="{ top: 0, right: 0, bottom: '#layers', left: '#preview' }"
      :links="{ top: '', right: '', bottom: '#layers', left: '#preview' }"
      >Styles</window
    >
    <window
      id="layers"
      @resize="resize++"
      :resize="resize"
      @update="update = $event"
      :update="update"
      :position="{
        top: 'calc(100% - 400px)',
        right: 0,
        bottom: '#timeline',
        left: '#preview'
      }"
      :links="{
        top: '#styles',
        right: '',
        bottom: '#timeline',
        left: '#preview'
      }"
      >Layers</window
    >
    <window
      id="timeline"
      @resize="resize++"
      :resize="resize"
      @update="update = $event"
      :update="update"
      :position="{ top: 'calc(100% - 200px)', right: 0, bottom: 0, left: 0 }"
      :links="{
        top: ['#tools', '#playground', '#preview', '#layers'],
        right: '',
        bottom: '',
        left: ''
      }"
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
      resize: 0,
      update: null
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
