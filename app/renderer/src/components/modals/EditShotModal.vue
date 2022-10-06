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
          v-if="shotToEdit && shotToEdit.id"
          class="title"
        >
          {{ $t('shots.edit_title') }} {{ shotToEdit.name }}
        </h1>
        <h1
          v-else
          class="title"
        >
          {{ $t('shots.new_shot') }}
        </h1>

        <form @submit.prevent>
          <combobox
            v-model="form.sequence_id"
            :label="$t('shots.fields.sequence')"
            :options="getSequenceOptions"
          />
          <text-field
            ref="nameField"
            v-model="form.name"
            v-focus
            :label="$t('shots.fields.name')"
            @enter="runConfirmation"
          />
          <textarea-field
            ref="descriptionField"
            v-model="form.description"
            :label="$t('shots.fields.description')"
            @keyup.ctrl.enter="runConfirmation"
            @keyup.meta.enter="runConfirmation"
          />
          <text-field
            ref="nbFramesField"
            v-model="form.nb_frames"
            v-focus
            :label="$t('shots.fields.nb_frames')"
            type="number"
            @enter="runConfirmation"
          />
          <text-field
            ref="frameInField"
            v-model="form.frameIn"
            :label="$t('shots.fields.frame_in')"
            type="number"
          />
          <text-field
            ref="frameOutField"
            v-model="form.frameOut"
            :label="$t('shots.fields.frame_out')"
            type="number"
            @enter="runConfirmation"
          />
          <text-field
            ref="fpsField"
            v-model="form.fps"
            :label="$t('shots.fields.fps')"
            type="number"
            @enter="runConfirmation"
          />
          <text-field
            ref="resolutionField"
            v-model="form.resolution"
            :label="$t('shots.fields.resolution')"
            @enter="runConfirmation"
          />
          <text-field
            ref="maxRetakesField"
            v-model="form.max_retakes"
            type="number"
            :label="$t('shots.fields.max_retakes')"
            @enter="runConfirmation"
          />

          <div
            v-for="descriptor in shotMetadataDescriptors"
            :key="descriptor.id"
          >
            <combobox
              v-if="descriptor.choices.length > 0"
              v-model="form.data[descriptor.field_name]"
              :label="descriptor.name"
              :options="getDescriptorChoicesOptions(descriptor)"
            />
            <text-field
              v-else
              v-model="form.data[descriptor.field_name]"
              :label="descriptor.name"
              @enter="runConfirmation"
            />
          </div>
        </form>

        <modal-footer
          :error-text="$t('shots.edit_fail')"
          :is-loading="isLoading"
          :is-error="isError"
          @confirm="confirmClicked"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatListMixin } from '@/components/mixins/format'
import { modalMixin } from '@/components/modals/base_modal'
import Combobox from '@/components/widgets/Combobox'
import ModalFooter from '@/components/modals/ModalFooter'
import TextField from '@/components/widgets/TextField'
import TextareaField from '@/components/widgets/TextareaField'

export default {
  name: 'EditShotModal',
  mixins: [formatListMixin, modalMixin],

  components: {
    Combobox,
    ModalFooter,
    TextField,
    TextareaField
  },

  props: [
    'onConfirmClicked',
    'text',
    'active',
    'cancelRoute',
    'isError',
    'isLoading',
    'isLoadingStay',
    'isSuccess',
    'shotToEdit',
    'errorText'
  ],

  data() {
    return {
      form: {
        data: {}
      },
      shotSuccessText: ''
    }
  },

  mounted() {
    this.resetForm()
  },

  computed: {
    ...mapGetters([
      'currentProduction',
      'getSequenceOptions',
      'getOpenProductionOptions',
      'openProductions',
      'sequences',
      'shots',
      'shotCreated',
      'shotMetadataDescriptors'
    ]),

    frameIn() {
      return this.shotToEdit.data ? this.shotToEdit.data.frame_in : ''
    },

    frameOut() {
      return this.shotToEdit.data ? this.shotToEdit.data.frame_out : ''
    },

    fps() {
      return this.shotToEdit.data ? this.shotToEdit.data.fps : ''
    },

    resolution() {
      return this.shotToEdit.data ? this.shotToEdit.data.resolution : ''
    },

    maxRetakes() {
      return this.shotToEdit.data
        ? parseInt(this.shotToEdit.data.max_retakes)
        : ''
    }
  },

  methods: {
    ...mapActions(['loadSequences']),

    runConfirmation() {
      if (this.isEditing()) {
        this.confirmClicked()
      } else {
        this.confirmAndStayClicked()
      }
    },

    confirmAndStayClicked() {
      this.$emit('confirmAndStay', this.form)
    },

    confirmClicked() {
      this.$emit('confirm', this.form)
    },

    getDescriptorChoicesOptions(descriptor) {
      const values = descriptor.choices.map((c) => ({ label: c, value: c }))
      return [{ label: '', value: '' }, ...values]
    },

    isEditing() {
      return this.shotToEdit && this.shotToEdit.id
    },

    resetForm() {
      this.shotSuccessText = ''
      if (!this.isEditing()) {
        if (this.openProductions.length > 0) {
          this.form.project_id = this.currentProduction
            ? this.currentProduction.id
            : ''
        }
        if (this.sequences.length > 0) {
          this.form.sequence_id = this.sequences[0].id
        }
        this.form.name = ''
        this.form.description = ''
        this.form.nb_frames = 0
        this.form.data = {}
      } else {
        this.form = {
          sequence_id: this.shotToEdit.sequence_id,
          project_id: this.shotToEdit.project_id,
          name: this.shotToEdit.name,
          description: this.shotToEdit.description,
          nb_frames: this.shotToEdit.nb_frames,
          frameIn: this.frameIn,
          frameOut: this.frameOut,
          fps: this.fps,
          max_retakes: this.maxRetakes,
          resolution: this.resolution,
          data: { ...this.shotToEdit.data } || {}
        }
      }
    }
  },

  watch: {
    active() {
      this.shotSuccessText = ''
      this.resetForm()
      if (this.sequences.length === 0) {
        this.loadSequences()
      }
      if (this.active) {
        setTimeout(() => {
          this.$refs.nameField.focus()
        }, 100)
      }
    },

    'form.frameIn'() {
      const frameIn = this.sanitizeInteger(this.form.frameIn)
      const frameOut = this.sanitizeInteger(this.form.frameOut)
      if (frameIn && frameOut && frameOut > frameIn) {
        this.form.nb_frames = frameOut - frameIn
      }
    },

    'form.frameOut'() {
      const frameIn = this.sanitizeInteger(this.form.frameIn)
      const frameOut = this.sanitizeInteger(this.form.frameOut)
      if (frameIn && frameOut && frameOut > frameIn) {
        this.form.nb_frames = frameOut - frameIn
      }
    },

    shotToEdit() {
      this.resetForm()
    },

    shotCreated() {
      if (this.isEditing()) {
        this.shotSuccessText = this.$t('shots.edit_success', {
          name: this.shotCreated
        })
      } else {
        this.shotSuccessText = this.$t('shots.new_success', {
          name: this.shotCreated
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-content .box p.text {
  margin-bottom: 1em;
}
.is-danger {
  color: #ff3860;
  font-style: italic;
}
.title {
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5em;
  margin-bottom: 1.2em;
}
.info-message {
  margin-top: 1em;
}

.modal-content {
  max-height: 80%;
}
</style>
