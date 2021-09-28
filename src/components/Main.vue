<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script setup>
export default {
  name: 'main-wrapper',
  components: {}

  /*mounted() {
    this.$socket.connect()
  }*/
}
</script>

<style>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $white-grey;
}
</style>
