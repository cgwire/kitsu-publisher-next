<template>
  <div
    ref="main"
    class="comment-menu hidden"
  >
    <div
      v-show="!isEmpty"
      @click="onPinClicked"
    >
      <span v-if="isPinned">
        {{ $t('comments.unpin') }}
      </span>
      <span v-else>{{ $t('comments.pin') }}</span>
    </div>
    <div
      v-if="isEditable"
      @click="$emit('edit-clicked')"
    >
      {{ $t('main.edit') }}
    </div>
    <div
      v-if="isEditable"
      class="error"
      @click="$emit('delete-clicked')"
    >
      {{ $t('main.delete') }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CommentMenu',

  props: {
    isPinned: {
      type: Boolean,
      default: false
    },
    isCurrentUserAdmin: {
      type: Boolean,
      default: false
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  computed: {
    ...mapGetters([])
  },

  methods: {
    ...mapActions([]),

    toggle() {
      const mainEl = this.$refs.main
      if (mainEl.className === 'comment-menu') {
        mainEl.className = 'comment-menu hidden'
      } else {
        mainEl.className = 'comment-menu'
      }
    },

    onPinClicked() {
      this.$emit('pin-clicked')
      this.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.dark .comment-menu {
  background-color: $dark-grey-light;
  box-shadow: 0px 2px 6px $dark-grey-light;
  color: $light-grey-light;
}

.comment-menu {
  border-radius: 10px;
  position: absolute;
  background: white;
  width: 118px;
  box-shadow: 0px 2px 6px $light-grey;
  top: 20px;
  left: -90px;
  z-index: 100;
}

.comment-menu div {
  cursor: pointer;

  &:hover {
    background-color: var(--background-alt);
  }
}

.comment-menu div {
  padding: 0.5em;
}
</style>
