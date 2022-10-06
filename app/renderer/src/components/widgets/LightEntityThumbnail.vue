<template>
  <img
    v-if="props.previewFileId"
    :key="props.previewFileId"
    v-lazy="
      '/api/pictures/' +
        props.type +
        '/preview-files/' +
        props.previewFileId +
        '.png'
    "
    class="thumbnail-picture"
    :style="{
      width: props.width,
      height: props.height,
      'max-width': props.maxWidth,
      'max-height': props.maxHeight
    }"
    v-bind="data.attrs"
  >
  <span
    v-else
    :class="{
      'thumbnail-picture': true,
      'thumbnail-empty': true
    }"
    :style="{
      width: props.width,
      height: props.emptyHeight ? props.emptyHeight : props.height
    }"
    v-bind="data.attrs"
  />
</template>

<script>
export default {
  name: 'LightEntityThumbnail',
  functional: true,

  props: {
    previewFileId: {
      default: '',
      type: String
    },
    width: {
      default: '150px',
      type: String
    },
    height: {
      default: '50px',
      type: String
    },
    maxHeight: {
      default: 'auto',
      type: String
    },
    maxWidth: {
      default: 'auto',
      type: String
    },
    emptyHeight: {
      type: String
    },
    type: {
      default: 'thumbnails',
      type: String
    }
  }
}
</script>

<style lang="scss">
.dark .thumbnail-picture {
  background-color: $dark-grey-lighter;
  border-color: $dark-grey-light;
}

span.thumbnail-empty {
  background: $white-grey;
  display: block;
  margin: 0;
}
</style>
