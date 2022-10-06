<template>
  <div
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div
      class="modal-background"
      @click="$emit('cancel')"
    />

    <div class="modal-content">
      <div class="box">
        <h1
          v-if="commentToEdit && commentToEdit.id"
          class="title"
        >
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
          <label class="label">
            {{ $t('comments.attachments') }}
          </label>
          <div
            v-if="commentToEdit && form.attachment_files.length > 0"
            class="attachments"
          >
            <div
              v-for="(attachment, index) in form.attachment_files"
              :key="'attachment-' + index"
              class="attachment-file"
            >
              {{ attachment.name }}
              <span @click="removeAttachment(attachment)">
                <icon
                  name="x"
                  size="0.9x"
                />
              </span>
            </div>
          </div>
          <div v-else>
            {{ $t('comments.no_attachments') }}
          </div>
        </form>
        <label class="label mt2">
          {{ $t('comments.attachments_to_add') }}
        </label>
        <div class="new-attachments">
          <div
            v-for="(attachment, index) in attachmentFiles"
            :key="'new-attachment-' + index"
            class="attachment-file"
          >
            {{ attachment.get('file').name }}
            <span @click="removeNewAttachment(attachment)">x</span>
          </div>
        </div>

        <div>
          <file-upload
            ref="file-field"
            class="flexrow-item"
            :accept="extensions"
            :is-primary="false"
            :label="$t('main.select_file')"
            :multiple="true"
            hide-file-names
            @fileselected="onFileSelected"
          />
        </div>
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
import files from '@/lib/files'

import Checklist from '@/components/widgets/Checklist'
import ComboBoxStatus from '@/components/widgets/ComboboxStatus.vue'
import FileUpload from '@/components/widgets/FileUpload'
import Icon from '@/components/widgets/Icon'
import ModalFooter from '@/components/modals/ModalFooter'

export default {
  name: 'EditCommentModal',
  mixins: [modalMixin],
  components: {
    Checklist,
    ComboBoxStatus,
    FileUpload,
    Icon,
    ModalFooter
  },

  props: {
    active: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    },
    commentToEdit: {
      type: Object,
      default: () => {}
    },
    team: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      attachmentFiles: [],
      extensions: files.ALL_EXTENSIONS_STRING,
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

  methods: {
    runConfirmation(event) {
      if (!event || event.keyCode === 13 || !event.keyCode) {
        const result = {
          id: this.commentToEdit.id,
          ...this.form,
          newAttachmentFiles: this.attachmentFiles,
          attachmentFilesToDelete: this.attachmentFilesToDelete
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

    removeAttachment(attachment) {
      this.form.attachment_files = remove(
        this.form.attachment_files,
        attachment
      )
      this.attachmentFilesToDelete.push(attachment)
    },

    removeNewAttachment(attachment) {
      this.attachmentFiles = remove(this.attachmentFiles, attachment)
    },

    onFileSelected(attachmentFiles) {
      this.attachmentFiles = attachmentFiles
    },

    reset() {
      this.attachmentFiles = []
      this.attachmentFilesToDelete = []
      if (this.commentToEdit && this.commentToEdit.id) {
        this.form = {
          text: this.commentToEdit.text,
          task_status_id: this.commentToEdit.task_status_id,
          checklist: [...this.commentToEdit.checklist],
          attachment_files: [...this.commentToEdit.attachment_files]
        }
        if (this.form.checklist.length === 0) {
          this.form.checklist = [{ checked: false, text: '' }]
        }
      } else {
        this.form = {
          text: '',
          task_status_id: null,
          checklist: [{ checked: false, text: '' }],
          attachment_files: []
        }
      }
    },

    onAddChecklistItem(item) {
      this.form.checklist[item.index].text =
        this.form.checklist[item.index].text.trim()
      delete item.index
      this.form.checklist.push(item)
    }
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
  margin-bottom: 2em;
}

.label.mt2 {
  margin-top: 2em;
}

.attachment-file {
  margin-top: 3px;
  margin-bottom: 3px;
  margin-left: 3px;
  margin-right: 3px;
  padding-bottom: 3px;
  border-bottom: 1px dashed $light-grey-light;

  span {
    cursor: pointer;
    float: right;
  }
}
</style>
