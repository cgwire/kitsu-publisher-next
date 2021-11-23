<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'MainWrapper',
  components: {}

  // TODO : reenable socket
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
