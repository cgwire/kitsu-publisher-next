<template>
<span>
  <vue-feather
    :size="width"
    :type="type"
  />
</span>
</template>

<script>
export default {
  name: 'icon',
  components: {
  },

  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 16
    }
  },

  computed: {
    type () {
      return this.name.length > 0 ? this.name : 'plus'
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
