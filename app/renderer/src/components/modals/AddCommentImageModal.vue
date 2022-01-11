<template>
  <div
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div class="modal-background" @click="$emit('cancel')" />

    <div class="modal-content">
      <div class="box content">
        <h1 class="title">
          {{ $t('tasks.comment_image') }}
        </h1>

        <p>
          {{ $t('tasks.select_file') }}
        </p>

        <file-upload
          ref="image-field"
          :label="$t('main.select_file')"
          :accept="extensions"
          :multiple="true"
          @fileselected="onFileSelected"
        />
        <p v-if="isError" class="error">$t('main.add')</p>

        <p v-if="isMovie" class="mt1">Or:</p>

        <p v-if="isMovie">
          <button class="button" @click="$emit('add-snapshots')">
            {{ $t('main.attach_snapshots') }}
          </button>
        </p>

        <p class="has-text-right">
          <a
            :class="{
              button: true,
              'is-primary': true,
              'is-loading': isLoading,
              'is-disabled': forms == undefined
            }"
            @click="confirm()"
          >
            {{ $t('main.confirmation') }}
          </a>
          <button class="button is-link" @click="$emit('cancel')">
            {{ $t('main.cancel') }}
          </button>
        </p>

        <p v-if="forms" class="upload-previews">
          <template v-for="(form, i) in forms" :key="'separator-' + i">
            <hr />
            <img v-if="isImage(form)" alt="uploaded file" :src="getURL(form)" />
            <video
              v-else-if="isVideo(form)"
              class="is-fullwidth"
              preload="auto"
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
    isMovie: {
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
      forms: null
    }
  },

  computed: {
    ...mapGetters([]),

    imageField() {
      return this.$refs['image-field']
    }
  },

  methods: {
    ...mapActions([]),

    onFileSelected(forms) {
      this.forms = forms
    },

    confirm() {
      this.$emit('confirm', this.forms)
    },

    reset() {
      this.imageField.reset()
      this.forms = null
    },

    onPaste(event) {
      if (this.active && event.clipboardData.files) {
        this.addFiles(event.clipboardData.files)
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

    addFiles(files) {
      this.imageField.filesChange('', files)
    }
  },

  watch: {
    active() {
      this.reset()
    }
  },

  mounted() {
    this.forms = null
    window.addEventListener('paste', this.onPaste, false)
  },

  beforeUnmount() {
    window.removeEventListener('paste', this.onPaste)
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
