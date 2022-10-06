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
        <h1 class="title">
          {{ $t('main.search_query_edit') }}
        </h1>

        <form @submit.prevent>
          <text-field
            ref="nameField"
            v-model="form.name"
            v-focus
            :label="$t('assets.fields.name')"
            @enter="runConfirmation"
          />

          <text-field
            ref="nameField"
            v-model="form.search_query"
            v-focus
            :label="$t('main.search_query')"
            @enter="runConfirmation"
          />
        </form>

        <modal-footer
          :error-text="$t('main.search_query_edit_error')"
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
/*
 * Modal used to edit search filter information. Users prefer to rename the
   filter label when it's too complex to read or too long.
 */
import { modalMixin } from '@/components/modals/base_modal'

import TextField from '@/components/widgets/TextField'
import ModalFooter from '@/components/modals/ModalFooter'

export default {
  name: 'EditSearchFilterModal',
  mixins: [modalMixin],
  components: {
    ModalFooter,
    TextField
  },

  props: ['active', 'isLoading', 'isError', 'searchQueryToEdit'],

  data() {
    if (this.searchQueryToEdit && this.searchQueryToEdit.id) {
      return {
        form: {
          text: this.searchQueryToEdit.text,
          task_status_id: this.searchQueryToEdit.task_status_id
        }
      }
    } else {
      return {
        form: {
          text: '',
          task_status_id: null
        }
      }
    }
  },

  computed: {},

  methods: {
    runConfirmation(event) {
      if (!event || event.keyCode === 13 || !event.keyCode) {
        this.$emit('confirm', {
          id: this.searchQueryToEdit.id,
          ...this.form
        })
      }
    }
  },

  watch: {
    searchQueryToEdit() {
      if (this.searchQueryToEdit && this.searchQueryToEdit.id) {
        this.form.id = this.searchQueryToEdit.id
        this.form.name = this.searchQueryToEdit.name
        this.form.search_query = this.searchQueryToEdit.search_query
      } else {
        this.form = {
          id: '',
          name: '',
          search_query: ''
        }
      }
    },

    active() {
      if (this.active) {
        setTimeout(() => {
          this.$refs.nameField.focus()
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
