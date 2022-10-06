<template>
  <td>
    <div class="flexrow">
      <people-avatar
        v-if="task.last_comment.person"
        class="flexrow-item avatar-wrapper"
        :is-link="false"
        :size="25"
        :font-size="14"
        :person="task.last_comment.person"
      />
      <span
        v-else
        class="no-avatar"
      > &nbsp; </span>

      <span
        v-if="commentText && commentText.length > 0"
        class="flexrow-item last-comment pointer"
        @click="onClick"
        v-html="compileMarkdown(commentText)"
      />
      <span
        v-else-if="task.last_comment.person"
        class="flexrow-item last-comment no-comment"
      >
        {{ $t('main.empty_comment') }}
      </span>
    </div>
  </td>
</template>

<script>
import { renderMarkdown } from '@/lib/render'
import { mapGetters, mapActions } from 'vuex'
import PeopleAvatar from '@/components/widgets/PeopleAvatar'

export default {
  name: 'LastCommentCell',
  components: {
    PeopleAvatar
  },

  data() {
    return {
      isOpen: false,
      timeout: null
    }
  },

  props: ['task'],

  computed: {
    ...mapGetters([]),

    commentText() {
      const text = this.task.last_comment.text
      const maxLength = 140
      let result = text || ''
      if (text !== undefined && text.length > maxLength) {
        result = text.slice(0, maxLength) + '...'
      }
      return result
    }
  },

  methods: {
    ...mapActions([]),

    compileMarkdown(input) {
      return renderMarkdown(input)
    },

    onClick() {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="scss" scoped>
.no-avatar {
  width: 30px;
}

.last-comment {
  margin-left: 0.6em;
}

.pointer {
  cursor: pointer;
}

.no-comment {
  font-style: italic;
}

.tooltip {
  width: 500px;
}
</style>
