<template>
  <button
    class="button"
    :title="buttonTitle"
    @click="$emit('click')"
  >
    <icon
      v-if="subscribed"
      name="eye"
      class="icon is-small only-icon"
    />
    <icon
      v-else
      name="eye-off"
      class="icon is-small only-icon"
    />
  </button>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'SubscribeButton',
  components: {
    Icon
  },
  props: {
    subscribed: {
      default: false,
      type: Boolean
    }
  },

  computed: {
    buttonTitle() {
      if (!this.subscribed) {
        return this.$t('tasks.subscribe_notifications')
      } else {
        return this.$t('tasks.unsubscribe_notifications')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button .icon.is-small.only-icon {
  margin-right: 0;
}
</style>
