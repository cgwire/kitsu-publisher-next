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
          :class="{
            'is-disabled': isCurrentlyOnTake
          }"
          :label="$t('main.csv.upload_file')"
          :accept="extensions"
          :multiple="true"
          @fileselected="onFileSelected"
        />

        <hr />

        <h3 v-if="DCCClients.length > 0" class="title">
          {{ DCCClients.length }}
          {{ $t('tasks.dcc_connectors') }}
          <span
            :class="{
              icon: true,
              'icon-right': true,
              'is-disabled': isCurrentlyOnTake
            }"
          >
            <icon
              name="refresh-cw"
              :width="20"
              :height="20"
              @click="refreshConnectedDCCClients()"
            />
          </span>

          <span v-if="!showOutputCommand"
            :class="{
              icon: true,
              'icon-right': true,
              'is-disabled': isCurrentlyOnTake || !exportCommandOutput
            }"
          >
            <icon
              name="file-plus"
              :width="20"
              :height="20"
              @click="showHideOutputCommand()"
            />
          </span>

          <span v-else
            :class="{
              icon: true,
              'icon-right': true,
              'is-disabled': isCurrentlyOnTake || !exportCommandOutput
            }"
          >
            <icon
              name="file-minus"
              :width="20"
              :height="20"
              @click="showHideOutputCommand()"
            />
          </span>
        </h3>

        <h3 v-else class="title">
          {{ $t('tasks.no_dcc_connectors') }}
          <span
            :class="{
              icon: true,
              'icon-right': true,
              'is-disabled': isCurrentlyOnTake
            }"
          >
            <icon
              name="refresh-cw"
              :width="20"
              :height="20"
              @click="refreshConnectedDCCClients()"
            />
          </span>
          <span
            :class="{
              icon: true,
              'icon-right': true,
              'is-disabled': true
            }"
          >
            <icon
              name="file-plus"
              :width="20"
              :height="20"
            />
          </span>
        </h3>

        <div v-if="exportCommandOutput && showOutputCommand" class="box content">
          {{ $t('tasks.command_launched') }}"{{ exportCommandOutput.command }}"<br>
          {{ $t('tasks.output') }}<br><pre v-html="exportCommandOutput.output"></pre>
          {{ $t('tasks.return_code') }}{{ exportCommandOutput.statusCode }}
          <br>
        </div>

        <div
          v-for="(DCCClient, index) in DCCClients"
          :key="index"
          class="box content"
        >
          <h3 class="title">
            {{ DCCClient.DCCName }} v{{ DCCClient.DCCVersion }}
          </h3>

          <h5 v-if="DCCClient.currentProject === ''" class="title">
            {{ $t('tasks.no_opened_project') }}
          </h5>

          <h5 v-else class="title">
            {{ $t('tasks.currently_opened_project') }}
            {{ DCCClient.currentProject }}
          </h5>

          <p>
            <span v-if="DCCClient.cameras.length > 0" class="select">
              <select
                :class="{
                  'select-input': true,
                  'is-disabled': isCurrentlyOnTake
                }"
                @change="(event) => DCCClient.setCamera(event.target.value)"
              >
                <option
                  v-for="camera in DCCClient.cameras"
                  :key="`${camera}`"
                  :value="camera"
                  :selected="camera === DCCClient.cameraSelected"
                >
                  {{ camera }}
                </option>
              </select>
            </span>

            <span v-if="DCCClient.renderers.length > 0" class="select">
              <select
                :class="{
                  'select-input': true,
                  'is-disabled': isCurrentlyOnTake
                }"
                @change="(event) => DCCClient.setRenderer(event.target.value)"
              >
                <option
                  v-for="renderer in DCCClient.renderers"
                  :key="`${renderer[1]}`"
                  :value="renderer[1]"
                  :selected="renderer[1] === DCCClient.rendererSelected"
                >
                  {{ renderer[0] }}
                </option>
              </select>
            </span>

            <button
              :class="{
                button: true,
                'is-loading': DCCClient.isCurrentlyOnTakeScreenshot,
                'is-disabled': isCurrentlyOnTake
              }"
              @click="onTake(DCCClient, false)"
            >
              {{ $t('tasks.take_screenshot') }}
            </button>

            <button
              :class="{
                button: true,
                'is-loading': DCCClient.isCurrentlyOnTakeAnimation,
                'is-disabled': isCurrentlyOnTake
              }"
              @click="onTake(DCCClient, true)"
            >
              {{ $t('tasks.take_animation') }}
            </button>
          </p>
        </div>

        <p v-if="isError" class="error">
          {{ $t('tasks.add_preview_error') }}
        </p>

        <p class="has-text-right">
          <a
            :class="{
              button: true,
              'is-primary': true,
              'is-loading': isLoading,
              'is-disabled': forms == undefined || isCurrentlyOnTake
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
              v-else-if="isPdf(form)"
              :key="i"
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
import Icon from '@/components/widgets/Icon'
import DCCClient from '@/lib/dccutils'
import formatUnicorn from 'format-unicorn/safe'
import AnsiUp from 'ansi_up'

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
      DCCClients: [],
      isCurrentlyOnTake: false,
      exportCommandOutput: null,
      showOutputCommand: false,
      AnsiUp: new AnsiUp
    }
  },

  computed: {
    ...mapGetters(['DCCsExportsDirectory', 'PostExportsCommand']),

    previewField() {
      return this.$refs['preview-field']
    }
  },

  methods: {
    ...mapActions([]),

    refreshConnectedDCCClients() {
      this.DCCClients = []
      for (let port = 10000; port <= 10099; port++) {
        let newClient = new DCCClient(`http://localhost:${port}`)
        newClient
          .getInformation()
          .then(() => {
            newClient.getCameras().then(() => {
              newClient.getRenderers().then(() => {
                newClient.getExtensions(true).then(() => {
                  newClient.getExtensions(false).then(() => {
                    this.DCCClients.push(newClient)
                  })
                })
              })
            })
          })
          .catch(() => {
            // do nothing
          })
      }
    },

    showHideOutputCommand() {
      this.showOutputCommand = !this.showOutputCommand
    },

    onFileSelected(forms) {
      this.exportCommandOutput = null
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

    onTake(DCCClient, isAnimation = false) {
      this.isCurrentlyOnTake = true
      ;(isAnimation
        ? DCCClient.takeRenderAnimation(
            DCCClient.rendererSelected,
            DCCClient.videoExtensionSelected
          )
        : DCCClient.takeRenderScreenshot(
            DCCClient.rendererSelected,
            DCCClient.imageExtensionSelected
          )
      ).then((data) => {
        const command = formatUnicorn(this.PostExportsCommand, {
          exportsDirectory: this.DCCsExportsDirectory,
          exportFile: data.file,
          exportIsAnimation: isAnimation,
          exportIsScreenshot: !isAnimation,
          rendererSelected: DCCClient.rendererSelected,
          extensionSelected: isAnimation
            ? DCCClient.videoExtensionSelected
            : DCCClient.imageExtensionSelected
        })
        window.electron.launchCommandBeforeExport(command).then((success, _) => {
          if (!success) {
            this.exportCommandOutput = null
          }
          const formData = new FormData()
          const file = new File(
            [window.electron.file.readFileSync(data.file)],
            data.file,
            { type: isAnimation ? 'video/mpeg' : 'image/jpeg' }
          )
          formData.append('file', file, file.name)
          this.forms = [formData]
          this.$emit('fileselected', this.forms)
          this.isCurrentlyOnTake = false
        })
      })
    },

    isPdf(form) {
      return form.get('file').type.indexOf('pdf') > 0
    }
  },

  watch: {
    active() {
      this.reset()
    }
  },

  mounted() {
    this.forms = null
    this.refreshConnectedDCCClients()
    window.addEventListener('paste', this.onPaste, false)
    window.electron.ipcRenderer.on('commandOutput', (_, commandOutput) => {
      this.exportCommandOutput = commandOutput
      this.exportCommandOutput.output = this.AnsiUp.ansi_to_html(this.exportCommandOutput.output)
    })
  },

  beforeUnmount() {
    window.removeEventListener('paste', this.onPaste)
  }
}
</script>

<style lang="scss" scoped>
.icon-right {
  float: right;
  cursor: pointer;
}

.is-disabled {
  opacity: 0.5;
}

.dark .select .is-disabled {
  border-color: #25282e;
  background: #36393f;
  color: #eee;
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
