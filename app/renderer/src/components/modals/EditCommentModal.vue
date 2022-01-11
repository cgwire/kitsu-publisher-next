<template>
  <div
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div class="modal-background" @click="$emit('cancel')" />

    <div class="modal-content">
      <div class="box">
        <h1 v-if="commentToEdit && commentToEdit.id" class="title">
          {{ $t('comments.edit_title') }}
        </h1>

        <form @submit.prevent>
          <combo-box-status
            v-model="form.task_status_id"
            :label="$t('task_status.title')"
            :task-status-list="taskStatusForCurrentUser"
          />

          <div class="field">
            <label class="label">
              {{ $t('comments.text') }}
            </label>
            <textarea
              ref="textField"
              v-model="form.text"
              v-focus
              class="input"
              @keyup.ctrl="runConfirmation"
              @keyup.meta="runConfirmation"
            />
          </div>
          <label class="label">
            {{ $t('comments.checklist') }}
          </label>
          <checklist
            class="comment-checklist"
            :checklist="form.checklist"
            @add-item="onAddChecklistItem"
            @remove-task="removeTask"
          />
        </form>

        <modal-footer
          :error-text="$t('comments.edit_error')"
          :is-error="isError"
          :is-loading="isLoading"
          @confirm="runConfirmation"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { modalMixin } from '@/components/modals/base_modal'
import { remove } from '@/lib/models'

// import AtTa from 'vue-at/dist/vue-at-textarea'
import Checklist from '@/components/widgets/Checklist'
import ComboBoxStatus from '@/components/widgets/ComboboxStatus.vue'
import ModalFooter from '@/components/modals/ModalFooter'

export default {
  name: 'EditCommentModal',
  components: {
    Checklist,
    ComboBoxStatus,
    ModalFooter
  },
  mixins: [modalMixin],

  props: [
    'active',
    'cancelRoute',
    'isLoading',
    'isError',
    'commentToEdit',
    'team'
  ],

  data() {
    return {
      form: {
        text: '',
        task_status_id: null,
        checklist: [{ checked: false, text: '' }]
      }
    }
  },

  computed: {
    ...mapGetters(['taskStatusForCurrentUser'])
  },

  watch: {
    commentToEdit() {
      this.reset()
    },

    active() {
      if (this.active) {
        setTimeout(() => {
          this.reset()
          this.$refs.textField.focus()
        }, 100)
      }
    }
  },

  methods: {
    runConfirmation(event) {
      if (!event || event.keyCode === 13 || !event.keyCode) {
        const result = {
          id: this.commentToEdit.id,
          ...this.form
        }
        const isEmptyChecklist =
          result.checklist.length === 1 && result.checklist[0].text === ''
        if (isEmptyChecklist) result.checklist = []
        this.$emit('confirm', result)
      }
    },

    removeTask(entry) {
      this.form.checklist = [...remove(this.form.checklist, entry)]
    },

    reset() {
      if (this.commentToEdit && this.commentToEdit.id) {
        this.form = {
          text: this.commentToEdit.text,
          task_status_id: this.commentToEdit.task_status_id,
          checklist: [...this.commentToEdit.checklist]
        }
        if (this.form.checklist.length === 0) {
          this.form.checklist = [{ checked: false, text: '' }]
        }
      } else {
        this.form = {
          text: '',
          task_status_id: null,
          checklist: [{ checked: false, text: '' }]
        }
      }
    },

    onAddChecklistItem(item) {
      this.form.checklist[item.index].text =
        this.form.checklist[item.index].text.trim()
      delete item.index
      this.form.checklist.push(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.is-danger {
  color: #ff3860;
  font-style: italic;
}

textarea {
  min-height: 8em;
  padding: 0.5em;
}

.modal-content {
  overflow: initial;
}

.comment-checklist {
  overflow-y: auto;
  max-height: 200px;
}
</style>
