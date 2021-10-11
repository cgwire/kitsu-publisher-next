<template>
  <div
    :class="{
      'c-mask': true,
      'is-active': displayed
    }"
    @click="$emit('click')"
  ></div>
</template>

<script>
export default {
  name: 'ComboboxMask',

  props: {
    displayed: {
      type: Boolean,
      default: false
    }
  },

  computed: {}
}
</script>

<style lang="scss" scoped></style>
