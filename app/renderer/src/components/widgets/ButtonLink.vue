<template>
  <router-link class="button" :title="title" :to="path">
    <span v-if="icon.length > 0 && icon.startsWith('fa')" class="icon is-small">
      <i :class="'fa ' + icon" />
    </span>
    <icon
      v-if="name"
      :name="name"
      :class="{
        icon: true,
        'is-small': true,
        'only-icon': !isText
      }"
    />
    <span
      v-if="isText"
      :class="{
        text: true,
        'is-hidden-touch': isResponsive
      }"
    >
      {{ text }}
    </span>
  </router-link>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'ButtonLink',
  components: {
    Icon
  },
  props: {
    text: {
      default: '',
      type: String
    },
    title: {
      default: '',
      type: String
    },
    path: {
      default: ''
    },
    icon: {
      default: '',
      type: String
    },
    isResponsive: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    isText() {
      return this.text && this.text.length > 0
    },

    name() {
      const names = {
        delete: 'trash',
        restore: 'rotate-ccw'
      }
      return names[this.icon] || this.icon
    }
  }
}
</script>

<style lang="scss" scoped>
.button .icon.is-small.only-icon {
  margin-right: 0;
}
</style>
