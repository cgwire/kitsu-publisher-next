<template>
  <div
    id="add-comment-modal"
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
        <h2 class="subtitle">
          {{ title }}
        </h2>
        <h1
          v-if="isEditing"
          class="title"
        >
          {{ $t('tasks.change_preview') }}
        </h1>
        <h1
          v-else
          class="title"
        >
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
          :is-primary="false"
          hide-file-names
          @fileselected="onFileSelected"
        />

        <hr>

        <h3
          v-if="Object.keys(DCCClients).length > 0"
          class="title"
        >
          {{ Object.keys(DCCClients).length }}
          {{ $t('tasks.dcc_connectors') }}
          <button
            :class="{
              button: true,
              'button-right': true,
              'is-disabled': isCurrentlyOnTake,
              'is-link': true
            }"
            @click="refreshConnectedDCCClients()"
          >
            <span class="icon">
              <icon
                name="refresh-cw"
                :width="20"
              />
            </span>
          </button>

          <button
            :class="{
              button: true,
              'button-right': true,
              'is-disabled': isCurrentlyOnTake || !exportCommandOutput,
              'is-link': true
            }"
            @click="showHideOutputCommand()"
          >
            <span>
              <icon
                :name="!showOutputCommand ? 'file-plus' : 'file-minus'"
                :width="20"
              />
            </span>
          </button>
        </h3>

        <h3
          v-else
          class="title"
        >
          {{ $t('tasks.no_dcc_connectors') }}
          <button
            :class="{
              button: true,
              'button-right': true,
              'is-disabled': isCurrentlyOnTake,
              'is-link': true
            }"
            @click="refreshConnectedDCCClients()"
          >
            <span class="icon">
              <icon
                name="refresh-cw"
                :width="20"
              />
            </span>
          </button>

          <button
            :class="{
              button: true,
              'button-right': true,
              'is-disabled': true,
              'is-link': true
            }"
            @click="showHideOutputCommand()"
          >
            <span>
              <icon
                name="file-plus"
                :width="20"
              />
            </span>
          </button>
        </h3>

        <div
          v-if="exportCommandOutput && showOutputCommand"
          class="box content"
        >
          {{ $t('tasks.command_launched') }}
          <pre><code v-html="exportCommandOutput.command" /></pre>
          {{ $t('tasks.output') }}
          <pre><code v-html="exportCommandOutput.output" /></pre>
          {{ $t('tasks.return_code') }}{{ exportCommandOutput.statusCode }}
        </div>

        <div
          v-for="port in Object.keys(DCCClients)"
          :key="port"
          class="box content box-content-dcc"
        >
          <h3 class="title">
            {{ DCCClients[port].DCCName }} v{{ DCCClients[port].DCCVersion }}
          </h3>

          <h5
            v-if="DCCClients[port].currentProject === ''"
            class="title"
          >
            {{ $t('tasks.no_opened_project') }}
          </h5>

          <h5
            v-else
            class="title"
          >
            {{ $t('tasks.currently_opened_project') }}
            {{ DCCClients[port].currentProject }}
          </h5>

          <p>
            <span
              v-if="DCCClients[port].cameras.length > 0"
              class="select"
            >
              <select
                :class="{
                  'select-input': true,
                  'is-disabled': isCurrentlyOnTake
                }"
                @change="
                  (event) => DCCClients[port].setCamera(event.target.value)
                "
              >
                <option
                  v-for="camera in DCCClients[port].cameras"
                  :key="`${camera}`"
                  :value="camera"
                  :selected="camera === DCCClients[port].cameraSelected"
                >
                  {{ camera }}
                </option>
              </select>
            </span>

            <span
              v-if="DCCClients[port].renderers.length > 0"
              class="select"
            >
              <select
                :class="{
                  'select-input': true,
                  'is-disabled': isCurrentlyOnTake
                }"
                @change="
                  (event) => DCCClients[port].setRenderer(event.target.value)
                "
              >
                <option
                  v-for="renderer in DCCClients[port].renderers"
                  :key="`${renderer[1]}`"
                  :value="renderer[1]"
                  :selected="renderer[1] === DCCClients[port].rendererSelected"
                >
                  {{ renderer[0] }}
                </option>
              </select>
            </span>

            <span
              v-if="DCCClients[port].sequences.length > 0"
              class="select"
            >
              <select
                :class="{
                  'select-input': true,
                  'is-disabled': isCurrentlyOnTake
                }"
                @change="
                  (event) => DCCClients[port].setSequence(event.target.value)
                "
              >
                <option
                  v-for="sequence in DCCClients[port].sequences"
                  :key="`${sequence}`"
                  :value="sequence"
                  :selected="sequence === DCCClients[port].sequenceSelected"
                >
                  {{ sequence }}
                </option>
              </select>
            </span>

            <button
              :class="{
                button: true,
                'is-loading': DCCClients[port].isCurrentlyOnTakeScreenshot,
                'is-disabled': isCurrentlyOnTake
              }"
              @click="onTake(DCCClients[port], false)"
            >
              {{ $t('tasks.take_screenshot') }}
            </button>

            <button
              :class="{
                button: true,
                'is-loading': DCCClients[port].isCurrentlyOnTakeAnimation,
                'is-disabled': isCurrentlyOnTake
              }"
              @click="onTake(DCCClients[port], true)"
            >
              {{ $t('tasks.take_animation') }}
            </button>
          </p>
        </div>

        <p
          v-if="isError"
          class="error"
        >
          {{ $t('tasks.add_preview_error') }}
        </p>

        <h3
          v-if="forms.length > 0"
          class="subtitle has-text-centered"
        >
          Selected Files
        </h3>
        <p
          v-if="forms.length > 0"
          class="upload-previews mt2"
        >
          <template
            v-for="(form, i) in forms"
            :key="'name-' + i"
          >
            <p class="preview-name">
              {{ form.get('file').name }}
              <span @click="removePreview(form)">x</span>
            </p>
            <img
              v-if="isImage(form)"
              :key="'image-' + i"
              alt="uploaded file"
              :src="getURL(form)"
            >
            <video
              v-else-if="isVideo(form)"
              :key="'video-' + i"
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
            <hr>
          </template>
        </p>

        <p class="has-text-right">
          <a
            :class="{
              button: true,
              'is-primary': true,
              'is-loading': isLoading,
              'is-disabled': forms.length === 0 || isCurrentlyOnTake
            }"
            @click="$emit('confirm')"
          >
            {{ $t('tasks.add_revision_confirm') }}
          </a>
          <button
            class="button is-link"
            @click="$emit('cancel')"
          >
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
import DCCClient from '@/lib/dccutils'
import AnsiUp from 'ansi_up'

export default {
  name: 'AddPreviewModal',
  mixins: [modalMixin],

  components: {
    FileUpload,
    Icon
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
    isEditing: {
      type: Boolean,
      default: false
    },
    extensions: {
      type: String,
      default: files.ALL_EXTENSIONS_STRING
    },
    title: {
      type: String,
      default: ''
    },
    currentTask: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      forms: [],
      DCCClients: [],
      isCurrentlyOnTake: false,
      exportCommandOutput: null,
      showOutputCommand: false,
      AnsiUp: new AnsiUp()
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
      this.DCCClients = {}
      for (let port = 10000; port <= 10099; port++) {
        let newClient = new DCCClient(port)
        newClient
          .getInformation()
          .then(() => {
            newClient.getCameras().then(() => {
              newClient.getRenderers().then(() => {
                newClient.getExtensions(true).then(() => {
                  newClient.getExtensions(false).then(() => {
                    newClient
                      .getSequences()
                      .then()
                      .catch()
                      .finally(() => {
                        this.DCCClients[port] = newClient
                      })
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
      this.forms = this.forms.concat(forms)
      this.$emit('fileselected', this.forms)
    },

    reset() {
      this.previewField.reset()
      this.forms = []
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

    isPdf(form) {
      return form.get('file').type.indexOf('pdf') > 0
    },

    onTake(DCCClient, isAnimation = false) {
      this.isCurrentlyOnTake = true
      ;(isAnimation
        ? DCCClient.takeRenderAnimation(
            DCCClient.rendererSelected,
            DCCClient.videoExtensionSelected,
            this.DCCsExportsDirectory
          )
        : DCCClient.takeRenderScreenshot(
            DCCClient.rendererSelected,
            DCCClient.imageExtensionSelected,
            this.DCCsExportsDirectory
          )
      ).then((data) => {
        let variablesFormat = {
          exportsDirectory: this.DCCsExportsDirectory,
          exportFile: data.file,
          exportIsAnimation: isAnimation,
          exportIsScreenshot: !isAnimation,
          DCCName: DCCClient.DCCName,
          DCCVersion: DCCClient.DCCVersion,
          currentProject: DCCClient.currentProject,
          cameraSelected: DCCClient.cameraSelected,
          rendererSelected: DCCClient.rendererSelected,
          extensionSelected: isAnimation
            ? DCCClient.videoExtensionSelected
            : DCCClient.imageExtensionSelected
        }
        if (this.currentTask) {
          variablesFormat = {
            ...variablesFormat,
            ...{
              entityName: this.currentTask.entity_name,
              entityTypeName: this.currentTask.entity_type_name,
              episodeName: this.currentTask.episode_name,
              fullEntityName: this.currentTask.full_entity_name,
              projectName: this.currentTask.project_name,
              taskStatusName: this.currentTask.task_status_name,
              taskTypeName: this.currentTask.task_type_name
            }
          }
        }
        window.electron
          .launchCommandBeforeExport(this.PostExportsCommand, variablesFormat)
          .then((success, _) => {
            if (!success) {
              this.exportCommandOutput = null
              const formData = new FormData()
              const file = new File(
                [window.electron.file.readFileSync(data.file)],
                data.file,
                { type: isAnimation ? 'video/mpeg' : 'image/jpeg' }
              )
              formData.append('file', file, file.name)
              this.forms = this.forms.concat(formData)
              this.$emit('fileselected', this.forms)
              this.isCurrentlyOnTake = false
            } else {
              if (isAnimation) DCCClient.isCurrentlyOnTakeAnimation = true
              else DCCClient.isCurrentlyOnTakeScreenshot = true

              window.electron.ipcRenderer.on(
                'commandOutput', 
                (_, commandOutput) => {
                  this.exportCommandOutput = commandOutput
                  this.exportCommandOutput.output = this.AnsiUp.ansi_to_html(
                    this.exportCommandOutput.output
                  )
                  const formData = new FormData()
                  const file = new File(
                    [window.electron.file.readFileSync(data.file)],
                    data.file,
                    { type: isAnimation ? 'video/mpeg' : 'image/jpeg' }
                  )
                  formData.append('file', file, file.name)
                  this.forms = this.forms.concat(formData)
                  this.$emit('fileselected', this.forms)
                  this.isCurrentlyOnTake = false
                  if (isAnimation) DCCClient.isCurrentlyOnTakeAnimation = false
                  else DCCClient.isCurrentlyOnTakeScreenshot = false
                  window.electron.ipcRenderer.removeAllListeners('commandOutput')
                }
              )
            }
          })
      })
    },

    removePreview(form) {
      this.forms = this.forms.filter((f) => f !== form)
    }
  },

  watch: {
    active() {
      this.reset()
    }
  },

  mounted() {
    this.forms = []
    this.refreshConnectedDCCClients()
    window.addEventListener('paste', this.onPaste, false)
  },

  beforeUnmount() {
    window.removeEventListener('paste', this.onPaste)
  }
}
</script>

<style lang="scss" scoped>
.button-right {
  float: right;
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

pre {
  margin: 5px;
  border: solid;
  background-color: transparent;
}

pre code {
  padding: 10px;
  max-height: 200px;
}

.subtitle {
  color: $grey;
  font-size: 1.2em;
  margin: 0;
  margin-bottom: 1em;
  padding: 0;
  text-transform: uppercase;
}

h1.title {
  font-weight: 350;
  line-height: 1.2em;
}

h3 {
  font-weight: 350;
  font-size: 1.4em;
  margin-top: 0.5em;
  padding: 0;
}

h3.subtitle {
  margin-top: 2em;
  font-weight: 400;
}

.preview-name span {
  cursor: pointer;
  float: right;
}

.box-content-dcc {
  padding: 0.5em 1em 1em 1em
}
</style>
