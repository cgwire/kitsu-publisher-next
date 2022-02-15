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
      <div class="box content">
        <h1
          v-if="!isEdit"
          class="title"
        >
          {{ $t('schedule.milestone.add_milestone') }}:
          {{ milestoneToEdit.date.format('YYYY-MM-DD') }}
        </h1>
        <h1
          v-else
          class="title"
        >
          {{ $t('schedule.milestone.edit_milestone') }}:
          {{ milestoneToEdit.date.format('YYYY-MM-DD') }}
        </h1>
        <text-field
          ref="nameField"
          v-model="form.name"
          v-focus
          :label="$t('schedule.milestone.name')"
          @enter="confirm"
        />
        <button-simple
          v-if="isEdit"
          class="button is-link error"
          text="Delete milestone"
          @click="$emit('remove-milestone', milestoneToEdit)"
        />

        <modal-footer
          :error-text="$t('schedule.milestone.error')"
          :is-error="isError"
          :is-loading="isLoading"
          :is-disabled="!isFormFilled"
          @confirm="confirm"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script>
/*
 * Modal used to edit and create milestones.
 */
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from '@/components/modals/base_modal'

import ButtonSimple from '@/components/widgets/ButtonSimple'
import ModalFooter from '@/components/modals/ModalFooter'
import TextField from '@/components/widgets/TextField'

export default {
  name: 'EditMilestoneModal',

  components: {
    ButtonSimple,
    ModalFooter,
    TextField
  },
  mixins: [modalMixin],

  props: {
    active: {
      type: Boolean,
      default: false
    },
    milestoneToEdit: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: {
        name: ''
      }
    }
  },

  mounted() {
    this.reset()
  },

  computed: {
    ...mapGetters([]),

    isEdit() {
      return this.milestoneToEdit.id !== undefined
    },

    isFormFilled() {
      return this.form.name.length > 0
    }
  },

  methods: {
    ...mapActions([]),

    confirm() {
      return this.$emit('confirm', this.form)
    },

    reset() {
      this.form = {
        id: this.milestoneToEdit.id || undefined,
        name: `${this.milestoneToEdit.name || ''}`,
        date: this.milestoneToEdit.date
      }
    }
  },

  watch: {
    active() {
      if (this.active) {
        this.reset()
        this.$nextTick(() => {
          this.$refs.nameField.focus()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
