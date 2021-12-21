<template>
  <div class="main">
    <topbar />
    <router-view />
  </div>
</template>

<script>
import Topbar from './tops/Topbar'

export default {
  name: 'MainWrapper',
  components: {
    Topbar
  },

  mounted() {
    this.$socket.connect()
  }
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
