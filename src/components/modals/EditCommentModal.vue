<template>
  <div
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div class="modal-background" @click="$emit('cancel')"></div>

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
            <!-- TODO : fix this
            <at-ta :members="team" name-key="full_name" limit="2">
              <template v-if="team && team.item" slot="item" slot-scope="team">
                <div class="flexrow">
                  <people-avatar
                    class="flexrow-item"
                    :person="team.item"
                    :size="20"
                    :no-cache="true"
                  />
                  <span class="flexrow-item">
                    {{ team.item.full_name }}
                  </span>
                </div>
              </template>

              <textarea
                ref="textField"
                v-model="form.text"
                v-focus
                class="input"
                @keyup.ctrl="runConfirmation"
                @keyup.meta="runConfirmation"
              >
              </textarea>
            </at-ta>
            -->
          </div>
          <label class="label">
            {{ $t('comments.checklist') }}
          </label>
          <checklist
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
import { modalMixin } from './base_modal'
import { remove } from '@/lib/models'

//import AtTa from 'vue-at/dist/vue-at-textarea' TODO : fix this
import Checklist from '../widgets/Checklist'
import ComboBoxStatus from '../widgets/ComboboxStatus.vue'
import ModalFooter from './ModalFooter'
//import PeopleAvatar from '../widgets/PeopleAvatar'

export default {
  name: 'EditCommentModal',
  components: {
    //AtTa,
    Checklist,
    ComboBoxStatus,
    ModalFooter
    //PeopleAvatar
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
        this.$emit('confirm', {
          id: this.commentToEdit.id,
          ...this.form
        })
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
</style>
