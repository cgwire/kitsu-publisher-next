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
        <h1 v-if="assetToEdit && assetToEdit.id" class="title">
          {{ $t('assets.edit_title') }} {{ assetToEdit.name }}
        </h1>
        <h1 v-else class="title">
          {{ $t('assets.new_asset') }}
        </h1>

        <form @submit.prevent>
          <combobox
            v-model="form.entity_type_id"
            :label="$t('assets.fields.type')"
            :options="productionAssetTypeOptions"
          />
          <combobox
            v-if="isTVShow"
            v-model="form.source_id"
            :label="$t('assets.fields.episode')"
            :options="episodeOptions"
          />
          <text-field
            ref="nameField"
            v-model="form.name"
            v-focus
            :label="$t('assets.fields.name')"
            @enter="runConfirmation"
          />
          <textarea-field
            ref="descriptionField"
            v-model="form.description"
            v-focus
            :label="$t('assets.fields.description')"
          />
          <div
            v-for="descriptor in assetMetadataDescriptors"
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

        <div class="has-text-right">
          <a
            v-if="!assetToEdit || !assetToEdit.id"
            :class="{
              button: true,
              'is-primary': true,
              'is-loading': isLoadingStay
            }"
            :disabled="form.name && form.name.length === 0"
            @click="confirmAndStayClicked"
          >
            {{ $t('main.confirmation_and_stay') }}
          </a>
          <a
            :class="{
              button: true,
              'is-primary': true,
              'is-loading': isLoading
            }"
            :disabled="form.name && form.name.length === 0"
            @click="confirmClicked"
          >
            {{ $t('main.confirmation') }}
          </a>
          <button class="button is-link" @click="$emit('cancel')">
            {{ $t('main.close') }}
          </button>
          <p v-if="isError" class="error has-text-right info-message">
            {{ $t('assets.edit_fail') }}
          </p>
          <p v-if="isSuccess" class="success has-text-right info-message">
            {{ assetSuccessText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from '@/components/modals/base_modal'
import { descriptorMixin } from '@/components/mixins/descriptors'

import TextField from '@/components/widgets/TextField'
import TextareaField from '@/components/widgets/TextareaField'
import Combobox from '@/components/widgets/Combobox'

export default {
  name: 'EditAssetModal',

  components: {
    TextField,
    TextareaField,
    Combobox
  },
  mixins: [descriptorMixin, modalMixin],

  props: {
    active: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    isError: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isLoadingStay: {
      type: Boolean,
      default: false
    },
    isSuccess: {
      type: Boolean,
      default: false
    },
    assetToEdit: {
      type: Object,
      default: () => {}
    },
    errorText: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      form: {
        name: '',
        description: '',
        source_id: null,
        data: {}
      },
      assetSuccessText: ''
    }
  },

  computed: {
    ...mapGetters([
      'assets',
      'assetCreated',
      'assetMetadataDescriptors',
      'assetTypes',
      'currentProduction',
      'currentEpisode',
      'episodes',
      'productionAssetTypes',
      'productionAssetTypeOptions',
      'isTVShow',
      'openProductions'
    ]),

    episodeOptions() {
      const options = this.episodes.map((episode) => {
        return {
          label: episode.name,
          value: episode.id
        }
      })
      options.unshift({
        label: this.$t('main.main_pack'),
        value: 'null'
      })
      return options
    }
  },

  mounted() {
    this.resetForm()
    this.assetSuccessText = ''
  },

  methods: {
    ...mapActions([]),

    runConfirmation() {
      if (this.form.name.length > 0) {
        if (this.isEditing()) {
          this.confirmClicked()
        } else {
          this.confirmAndStayClicked()
        }
      }
    },

    focusName() {
      this.$refs.nameField.focus()
    },

    confirmAndStayClicked() {
      this.$emit('confirmAndStay', this.form)
    },

    confirmClicked() {
      this.$emit('confirm', this.form)
    },

    isEditing() {
      return this.assetToEdit && this.assetToEdit.id
    },

    resetForm() {
      if (!this.isEditing()) {
        if (!this.form.entity_type_id && this.productionAssetTypes.length > 0) {
          this.form.entity_type_id = this.productionAssetTypes[0].id
        }
        if (this.openProductions.length > 0) {
          this.form.project_id = this.currentProduction
            ? this.currentProduction.id
            : ''
        }
        this.form.name = ''
        this.form.description = ''
        this.form.source_id = this.currentEpisode
          ? this.currentEpisode.id
          : null
        this.form.data = {}
      } else {
        this.form = {
          entity_type_id: this.assetToEdit.asset_type_id,
          project_id: this.assetToEdit.project_id,
          name: this.assetToEdit.name,
          description: this.assetToEdit.description,
          source_id: this.assetToEdit.source_id || this.assetToEdit.episode_id,
          data: { ...this.assetToEdit.data } || {}
        }
      }
    }
  },

  watch: {
    assetToEdit() {
      this.resetForm()
    },

    assetCreated() {
      if (this.isEditing()) {
        this.assetSuccessText = this.$t('assets.edit_success', {
          name: this.assetCreated
        })
      } else {
        this.assetSuccessText = this.$t('assets.new_success', {
          name: this.assetCreated
        })
      }
    },

    active() {
      this.assetSuccessText = ''
      this.resetForm()
      if (this.active) {
        setTimeout(() => {
          this.$refs.nameField.focus()
        }, 100)
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

.info-message {
  margin-top: 1em;
}
</style>
