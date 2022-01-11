<template>
  <button
    :class="{
      button: true,
      active: active,
      small: isSmall,
      'is-primary': isPrimary,
      'is-loading': isLoading,
      'is-on': isOn
    }"
    :title="title"
  >
    <icon v-if="name && name !== ''" :class="iconClass" :name="name" />
    <span
      v-if="isText"
      :class="{
        text: true,
        'is-hidden-touch': isResponsive
      }"
    >
      {{ text }}
    </span>
  </button>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'ButtonSimple',
  components: {
    Icon
  },

  props: {
    active: {
      default: false,
      type: Boolean
    },
    icon: {
      default: '',
      type: String
    },
    isOn: {
      default: false,
      type: Boolean
    },
    isLoading: {
      default: false,
      type: Boolean
    },
    isPrimary: {
      default: false,
      type: Boolean
    },
    isResponsive: {
      default: false,
      type: Boolean
    },
    isSmall: {
      default: false,
      type: Boolean
    },
    text: {
      default: '',
      type: String
    },
    title: {
      default: '',
      type: String
    }
  },

  computed: {
    isText() {
      return this.text && this.text.length > 0
    },

    name() {
      const names = {
        delete: 'trash',
        restore: 'rotate-ccw',
        undo: 'corner-left-down',
        redo: 'corner-right-down',
        comment: 'message-square',
        back: 'skip-back',
        forward: 'skip-forward',
        fullscreen: 'maximize',
        down: 'chevron-down',
        left: 'chevron-left',
        right: 'chevron-right',
        compare: 'copy',
        remove: 'x',
        pencil: 'edit-2',
        funnel: 'filter',
        refresh: 'refresh-cw',
        soundoff: 'volume-x',
        soundon: 'volume-2'
      }
      return names[this.icon] || this.icon || ''
    },

    iconClass() {
      return {
        icon: true,
        'is-small': true,
        'only-icon': !this.isText
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon.is-small.only-icon {
  margin-right: 0;
}

.is-primary {
  border-radius: 2em;
}

.active {
  box-shadow: inset 0 0 2px 2px var(--box-shadow);
}

.small {
  font-size: 0.8em;
  padding: 0.4em;
}
</style>
