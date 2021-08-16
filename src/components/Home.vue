<template>
  <img alt="Kitsu logo" src="src/assets/logo.png" />
  <h1>Kitsu Publisher</h1>
  <button class="button" type="button" @click="state.count++">
    count is: {{ state.count }}
  </button>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  msg: String
})

const state = reactive({ count: 0 })
</script>

<style lang="scss" scoped>
h1 {
  color: $green;
}
</style>
