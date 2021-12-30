<template>
  <div
    id="add-comment-modal"
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div class="modal-background" @click="$emit('cancel')" />

    <div class="modal-content">
      <div class="box content">
        <h1 v-if="isEditing" class="title">
          {{ $t('tasks.change_preview') }}
        </h1>
        <h1 v-else class="title">
          {{ $t('tasks.add_preview') }}
        </h1>

        <p>
          {{ $t('tasks.select_preview_file') }}
        </p>

        <file-upload
          ref="preview-field"
          :label="$t('main.csv.upload_file')"
          :accept="extensions"
          :multiple="true"
          @fileselected="onFileSelected"
        />

        <hr />

        <h3 v-if="dcc_client_manager.connectedClients.length > 0" class="title">
          {{ dcc_client_manager.connectedClients.length }}
          {{ $t('tasks.dcc_connectors') }}
          <span class="icon icon-right">
            <icon
              name="refresh-cw"
              :width="20"
              height="20"
              @click="dcc_client_manager.refreshConnectedClients()"
            />
          </span>
        </h3>

        <h3 v-else class="title">
          {{ $t('tasks.no_dcc_connectors') }}
          <span class="icon icon-right">
            <icon
              name="refresh-cw"
              :width="20"
              height="20"
              @click="dcc_client_manager.refreshConnectedClients()"
            />
          </span>
        </h3>

        <div
          v-for="(dcc_client, index) in dcc_client_manager.connectedClients"
          :key="index"
          class="box content"
        >
          <h3 class="title">
            {{ dcc_client.dcc_name }} v{{ dcc_client.dcc_version }}
          </h3>

          <h5 v-if="dcc_client.current_project === ''" class="title">
            {{ $t('tasks.no_opened_project') }}
          </h5>

          <h5 v-else class="title">
            {{ $t('tasks.currently_opened_project') }}
            {{ dcc_client.current_project }}
          </h5>

          <p>
            <span class="select">
              <select
                class="select-input"
                @change="(event) => dcc_client.setCamera(event.target.value)"
              >
                <option
                  v-for="camera in dcc_client.cameras"
                  :key="`${camera}`"
                  :value="camera"
                  :selected="camera === dcc_client.camera_selected"
                >
                  {{ camera }}
                </option>
              </select>
            </span>

            <span class="select">
              <select
                class="select-input"
                @change="(event) => dcc_client.setRenderer(event.target.value)"
              >
                <option
                  v-for="renderer in dcc_client.renderers"
                  :key="`${renderer[1]}`"
                  :value="renderer[1]"
                  :selected="renderer[1] === dcc_client.renderer_selected"
                >
                  {{ renderer[0] }}
                </option>
              </select>
            </span>

            <button class="button" @click="onTake(dcc_client, false)">
              {{ $t('tasks.take_screenshot') }}
            </button>

            <button class="button" @click="onTake(dcc_client, true)">
              {{ $t('tasks.take_animation') }}
            </button>
          </p>
        </div>

        <p v-if="forms" class="upload-previews">
          <template v-for="(form, i) in forms" :key="'preview-' + i">
            <hr />
            <img v-if="isImage(form)" alt="uploaded file" :src="getURL(form)" />
            <video
              v-else-if="isVideo(form)"
              preload="auto"
              class="is-fullwidth"
              autoplay
              controls
              loop
              muted
              :src="getURL(form)"
            />
            <iframe
              v-else
              class="is-fullwidth"
              frameborder="0"
              :src="getURL(form)"
            />
          </template>
        </p>

        <p v-if="isError" class="error">
          {{ $t('tasks.add_preview_error') }}
        </p>

        <p class="has-text-right">
          <a
            :class="{
              button: true,
              'is-primary': true,
              'is-loading': isLoading,
              'is-disabled': forms == undefined
            }"
            @click="$emit('confirm')"
          >
            {{ $t('main.confirmation') }}
          </a>
          <button class="button is-link" @click="$emit('cancel')">
            {{ $t('main.cancel') }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from '@/components/modals/base_modal'
import files from '@/lib/files'
import FileUpload from '@/components/widgets/FileUpload.vue'
import Icon from '@/components/widgets/Icon'
import { DCCClientManager } from '@/lib/dccutils_client'

export default {
  name: 'AddPreviewModal',

  components: {
    FileUpload,
    Icon
  },
  mixins: [modalMixin],

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
    isEditing: {
      type: Boolean,
      default: false
    },
    extensions: {
      type: String,
      default: files.ALL_EXTENSIONS_STRING
    }
  },

  data() {
    return {
      forms: null,
      dcc_client_manager: new DCCClientManager()
    }
  },

  computed: {
    ...mapGetters([]),

    previewField() {
      return this.$refs['preview-field']
    }
  },

  watch: {
    active() {
      this.reset()
    }
  },

  mounted() {
    this.forms = null
    this.dcc_client_manager.refreshConnectedClients()

    window.addEventListener('paste', this.onPaste, false)
  },

  beforeUnmount() {
    window.removeEventListener('paste', this.onPaste)
  },

  methods: {
    ...mapActions([]),

    onFileSelected(forms) {
      this.forms = forms
      this.$emit('fileselected', forms)
    },

    reset() {
      this.previewField.reset()
      this.forms = null
    },

    onPaste(event) {
      if (this.active && event.clipboardData.files) {
        this.previewField.filesChange('', event.clipboardData.files)
      }
    },

    getURL(form) {
      return window.URL.createObjectURL(form.get('file'))
    },

    isImage(form) {
      return form.get('file').type.startsWith('image')
    },

    isVideo(form) {
      return form.get('file').type.startsWith('video')
    },

    onTake(dcc_client, is_animation = false) {
      ;(is_animation
        ? dcc_client.takeRenderAnimation(
            dcc_client.renderer_selected,
            dcc_client.video_extension_selected
          )
        : dcc_client.takeRenderScreenshot(
            dcc_client.renderer_selected,
            dcc_client.image_extension_selected
          )
      ).then((data) => {
        const formData = new FormData()
        const file = new File(
          [window.electron.file.readFileSync(data.file)],
          data.file,
          { type: is_animation ? 'video/mpeg' : 'image/jpeg' }
        )
        formData.append('file', file, file.name)
        this.forms = [formData]
        this.$emit('fileselected', this.forms)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-right {
  float: right;
}

.modal-content {
  max-height: calc(100vh - 150px);
}

.modal-content .box p.text {
  margin-bottom: 1em;
}

.error {
  margin-top: 1em;
}

.description {
  margin-bottom: 1em;
}

.is-fullwidth {
  width: 100%;
}

.upload-previews {
  text-align: center;
}
</style>
