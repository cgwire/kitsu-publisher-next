<template>
  <h1 class="title hide-small-screen">
    {{ text }}
  </h1>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    text: {
      default: '',
      type: String
    }
  }
}
</script>

<style lang="scss" scoped></style>
