<template>
  <div>
    <p class="has-text-right">
      <a
        :class="{
          button: true,
          'is-primary': true,
          'is-loading': isLoading,
          'is-disabled': isDisabled
        }"
        @click="$emit('confirm')"
      >
        {{ confirmLabel || $t('main.confirmation') }}
      </a>
      <button class="button is-link" @click="$emit('cancel')">
        {{ cancelLabel || $t('main.cancel') }}
      </button>
    </p>
    <p v-if="isError" class="error mt1 has-text-right">
      {{ errorText }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ModalFooter',

  components: {},

  props: {
    cancelLabel: {
      type: String,
      default: ''
    },
    confirmLabel: {
      type: String,
      default: ''
    },
    errorText: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([])
  },

  methods: {
    ...mapActions([])
  },

  watch: {}
}
</script>

<style lang="scss" scoped>
.error {
  margin-top: 1em;
}
</style>
