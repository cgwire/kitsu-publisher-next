<template>
  <div
    id="model-container"
    :style="{
      height: defaultHeight ? defaultHeight + 'px' : '100%',
      width: '100%'
    }"
    :class="{
      light: light && !readOnly
    }"
  >
    <model-viewer
      id="model-viewer"
      loading="eager"
      camera-controls
      :src="previewUrl"
    />
  </div>
</template>

<script>
import('@google/model-viewer')

export default {
  name: 'ObjectViewer',

  components: {},

  props: {
    previewUrl: {
      default: '',
      type: String
    },
    previewDlPath: {
      default: '',
      type: String
    },
    light: {
      default: false,
      type: Boolean
    },
    readOnly: {
      default: false,
      type: Boolean
    },
    empty: {
      default: false,
      type: Boolean
    },
    defaultHeight: {
      type: Number,
      default: 0
    },
    fullScreen: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return {
      isLoading: false
    }
  },

  computed: {
    container() {
      return this.$refs.container
    }
  },

  watch: {
    defaultHeight() {},

    previewUrl() {},

    light() {}
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
#model-viewer.light {
  height: 200px;
}

#model-viewer {
  height: 100%;
  width: 100%;
}
</style>
