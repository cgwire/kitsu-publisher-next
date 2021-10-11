<template>
  <div>
    <div
      v-for="(entry, index) in checklist"
      :key="'comment-checklist-' + '-' + index"
      :class="{
        'checklist-entry': true,
        flexrow: true,
        checked: entry.checked
      }"
    >
      <span class="flexrow-item" @click="toggleEntryChecked(entry)">
        <icon v-if="entry.checked" name="check-square" class="icon" />
        <icon v-else name="square" class="icon" />
      </span>
      <textarea-autosize
        :ref="`checklist-entry-${index}`"
        v-model="entry.text"
        type="text"
        class="checklist-text flexrow-item"
        rows="1"
        :placeholder="$t('comments.task_placeholder')"
        :disabled="disabled"
        @keypress.enter.prevent="addChecklistEntry(index, $event)"
        @keyup.backspace="removeChecklistEntry(index)"
        @keyup.up="focusPrevious(index)"
        @keyup.down="focusNext(index)"
      />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'Checklist',

  components: {
    Icon
  },

  props: {
    checklist: {
      default: () => [],
      type: Array
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },

  methods: {
    addChecklistEntry(index, event) {
      if (index === -1 || index === this.checklist.length - 1) {
        this.$emit('add-item', {
          index,
          text: '',
          checked: false
        })
      }

      this.$nextTick(() => {
        this.focusNext(index)
      })
    },

    removeChecklistEntry(index) {
      const entry = this.checklist[index]
      if (entry.text.length === 0) {
        this.$emit('remove-task', entry)
        this.focusPrevious(index)
      }
    },

    focusPrevious(index) {
      if (this.checklist.length > 0) {
        if (index === 0) index = this.checklist.length
        index--
        const entryRef = `checklist-entry-${index}`
        this.$refs[entryRef][0].$el.focus()
      }
    },

    focusNext(index) {
      if (this.checklist.length > 0) {
        if (index === this.checklist.length - 1) index = -1
        index++
        const entryRef = `checklist-entry-${index}`
        this.$refs[entryRef][0].$el.focus()
      }
    },

    toggleEntryChecked(entry) {
      entry.checked = !entry.checked
      this.$emit('emit-change')
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .checklist-entry {
    .checklist-text {
      color: $light-grey-light;
      background: transparent;

      &:active,
      &:focus,
      &:hover {
        background: $dark-grey;
        border: 1px solid $dark-grey-strong;
      }

      &:disabled {
        background: transparent;
        color: white;

        &:hover {
          border: 1px solid transparent;
        }
      }
    }
  }
}

.checklist-entry {
  color: $grey;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 0.3em;

  .checklist-text {
    font-size: 0.9em;
    padding: 0.2em;
    padding-top: 0em;
    margin-right: 0.5em;
    margin-top: 4px;
    width: 100%;
    min-height: 20px;
    border: 1px solid transparent;

    &:focus,
    &:active,
    &:hover {
      border: 1px solid $light-grey;
    }

    &:disabled {
      background-color: white;
      color: #333;

      &:hover {
        border: 1px solid transparent;
      }
    }
  }

  &.checked .checklist-text {
    text-decoration: line-through;
  }

  span {
    cursor: pointer;
    padding: 0.2em 0 0 0;
    margin-right: 0.2em;
    margin-left: 0;

    .icon {
      width: 20px;
    }
  }
}
</style>
