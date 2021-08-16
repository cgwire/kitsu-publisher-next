<template>
  <Main />
</template>

<script setup>
import Main from './components/Main.vue'
</script>

<style lang="scss">
@font-face {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  src: url(assets/Lato.woff2) format("woff2");
}

html {
  height: 100%;
  overflow-y: auto;
  font-family: Lato, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  height: 100%;
  min-height: 100%;
  width: 100%;
  background: #EEE;
  overflow: auto;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
}

.dark {
}
</style>
