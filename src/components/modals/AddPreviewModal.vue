<template>
  <div
    id="add-comment-modal"
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div class="modal-background" @click="$emit('cancel')"></div>

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

        <span class="select">
          <select
            class="select-input"
            @change="(event) => onCameraChanged(event)"
          >
            <option
              v-for="option in list_cameras"
              :key="`${option}`"
              :value="option"
              :selected="option === camera_selected"
            >
              {{ option }}
            </option>
          </select>
        </span>

        <span class="select">
          <select
            class="select-input"
            @change="(event) => onRendererChanged(event)"
          >
            <option
              v-for="option in list_renderers"
              :key="`${option[1]}`"
              :value="option[1]"
              :selected="option[1] === renderer_selected"
            >
              {{ option[0] }}
            </option>
          </select>
        </span>

        <button class="button is-link" @click="onTakeScreenshotClick()">
          {{ 'take screenshot' }}
        </button>

        <button class="button is-link" @click="onTakeAnimationClick()">
          {{ 'take animation' }}
        </button>

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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from '@/components/modals/base_modal'
import files from '@/lib/files'
import FileUpload from '@/components/widgets/FileUpload.vue'
import DCCClient from '@/lib/dccutils_client'

export default {
  name: 'AddPreviewModal',

  components: {
    FileUpload
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
      list_cameras: null,
      camera_selected: null,
      list_renderers: null,
      renderer_selected: null,
      dccutils_blender: new DCCClient('http://localhost:8089')
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
    this.dccutils_blender.getCameras().then((response) => {
      this.list_cameras = response.data
      this.camera_selected = response.data[0]
    })
    this.dccutils_blender.getRenderers().then((response) => {
      this.list_renderers = response.data
    })
    this.renderer_selected = 'BLENDER_EEVEE'
    this.extension_screenshot_selected = 'JPEG'
    this.extension_animation_selected = 'MPEG4'
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

    onCameraChanged(event) {
      this.camera_selected = event.target.value
      this.dccutils_blender.setCamera(this.camera_selected)
    },

    onRendererChanged(event) {
      this.renderer_selected = event.target.value
    },
    onTake(is_animation = false) {
      ;(is_animation
        ? this.dccutils_blender.takeRenderAnimation(
            this.renderer_selected,
            this.extension_animation_selected
          )
        : this.dccutils_blender.takeRenderScreenshot(
            this.renderer_selected,
            this.extension_screenshot_selected
          )
      ).then((response) => {
        const formData = new FormData()
        const file = new File(
          [require('fs').readFileSync(response.data)],
          response.data,
          { type: is_animation ? 'video/mpeg' : 'image/jpeg' }
        )
        formData.append('file', file, file.name)
        this.forms = [formData]
        this.$emit('fileselected', this.forms)
      })
    },
    onTakeScreenshotClick() {
      this.onTake(false)
    },
    onTakeAnimationClick() {
      this.onTake(true)
    }
  }
}
</script>

<style lang="scss" scoped>
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
