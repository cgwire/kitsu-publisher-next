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

        <h3 class="title">Blender</h3>

        <p>
          <span class="select">
            <select
              class="select-input"
              @change="(event) => onBlenderCameraChanged(event)"
            >
              <option
                v-for="option in blender_list_cameras"
                :key="`${option}`"
                :value="option"
                :selected="option === blender_camera_selected"
              >
                {{ option }}
              </option>
            </select>
          </span>

          <span class="select">
            <select
              class="select-input"
              @change="(event) => onBlenderRendererChanged(event)"
            >
              <option
                v-for="option in blender_list_renderers"
                :key="`${option[1]}`"
                :value="option[1]"
                :selected="option[1] === blender_renderer_selected"
              >
                {{ option[0] }}
              </option>
            </select>
          </span>

          <button class="button" @click="onBlenderTakeScreenshotClick()">
            {{ $t('tasks.take_screenshot') }}
          </button>

          <button class="button" @click="onBlenderTakeAnimationClick()">
            {{ $t('tasks.take_animation') }}
          </button>
        </p>

        <h3 class="title">Toon Boom Harmony</h3>
        <p>
          <span class="select">
            <select
              class="select-input"
              @change="(event) => onHarmonyCameraChanged(event)"
            >
              <option
                v-for="option in harmony_list_cameras"
                :key="`${option}`"
                :value="option"
                :selected="option === harmony_camera_selected"
              >
                {{ option }}
              </option>
            </select>
          </span>

          <span class="select">
            <select
              class="select-input"
              @change="(event) => onHarmonyRendererChanged(event)"
            >
              <option
                v-for="option in harmony_list_renderers"
                :key="`${option[1]}`"
                :value="option[1]"
                :selected="option[1] === harmony_renderer_selected"
              >
                {{ option[0] }}
              </option>
            </select>
          </span>

          <button class="button" @click="onHarmonyTakeScreenshotClick()">
            {{ $t('tasks.take_screenshot') }}
          </button>

          <button class="button" @click="onHarmonyTakeAnimationClick()">
            {{ $t('tasks.take_animation') }}
          </button>
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
      dccutils_blender: new DCCClient('http://localhost:8089'),
      dccutils_harmony: new DCCClient('http://localhost:8085')
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

    // BLENDER
    this.dccutils_blender.getCameras().then((response) => {
      this.blender_list_cameras = response.data
      this.blender_camera_selected =
        response.data.length > 0 ? response.data[0] : undefined
    })
    this.dccutils_blender.getRenderers().then((response) => {
      this.blender_list_renderers = response.data
    })
    this.blender_renderer_selected = 'BLENDER_EEVEE'
    this.blender_extension_screenshot_selected = 'JPEG'
    this.blender_extension_animation_selected = 'MPEG4'

    //HARMONY
    this.dccutils_harmony.getCameras().then((response) => {
      this.harmony_list_cameras = response.data
      this.harmony_camera_selected =
        response.data.length > 0 ? response.data[0] : undefined
    })
    this.dccutils_harmony.getRenderers().then((response) => {
      this.harmony_list_renderers = response.data
    })
    this.harmony_renderer_selected = 'Display'
    this.harmony_extension_screenshot_selected = '.png'
    this.harmony_extension_animation_selected = '.mov'

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

    //BLENDER
    onBlenderCameraChanged(event) {
      this.blender_camera_selected = event.target.value
      this.dccutils_blender.setCamera(this.blender_camera_selected)
    },

    onBlenderRendererChanged(event) {
      this.blender_renderer_selected = event.target.value
    },
    onBlenderTake(is_animation = false) {
      ;(is_animation
        ? this.dccutils_blender.takeRenderAnimation(
            this.blender_renderer_selected,
            this.blender_extension_animation_selected
          )
        : this.dccutils_blender.takeRenderScreenshot(
            this.blender_renderer_selected,
            this.blender_extension_screenshot_selected
          )
      ).then((response) => {
        const formData = new FormData()
        const file = new File(
          [window.electron.file.readFileSync(response.data.file)],
          response.data.file,
          { type: is_animation ? 'video/mpeg' : 'image/jpeg' }
        )
        formData.append('file', file, file.name)
        this.forms = [formData]
        this.$emit('fileselected', this.forms)
      })
    },

    onBlenderTakeScreenshotClick() {
      this.onBlenderTake(false)
    },

    onBlenderTakeAnimationClick() {
      this.onBlenderTake(true)
    },

    onHarmonyCameraChanged(event) {
      this.harmony_camera_selected = event.target.value
      this.dccutils_harmony.setCamera(this.harmony_camera_selected)
    },

    onHarmonyRendererChanged(event) {
      this.harmony_renderer_selected = event.target.value
    },
    onHarmonyTake(is_animation = false) {
      ;(is_animation
        ? this.dccutils_harmony.takeRenderAnimation(
            this.harmony_renderer_selected,
            this.harmony_extension_animation_selected
          )
        : this.dccutils_harmony.takeRenderScreenshot(
            this.harmony_renderer_selected,
            this.harmony_extension_screenshot_selected
          )
      ).then((response) => {
        const formData = new FormData()
        const file = new File(
          [window.electron.file.readFileSync(response.data.file)],
          response.data.file,
          { type: is_animation ? 'video/mpeg' : 'image/jpeg' }
        )
        formData.append('file', file, file.name)
        this.forms = [formData]
        this.$emit('fileselected', this.forms)
      })
    },

    onHarmonyTakeScreenshotClick() {
      this.onHarmonyTake(false)
    },

    onHarmonyTakeAnimationClick() {
      this.onHarmonyTake(true)
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
