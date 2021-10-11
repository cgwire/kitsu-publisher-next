<template>
  <div
    ref="wrapper"
    class="file-upload-wrapper"
    @drop="onDrop"
    @dragover="onDragover"
    @dragleave="onDragleave"
  >
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <label
          :class="{
            button: true,
            'is-primary': isPrimary
          }"
        >
          {{ label }}
          <input
            ref="uploadInput"
            type="file"
            :accept="accept"
            :name="uploadFieldName"
            :disabled="isSaving || disabled"
            class="visuallyhidden"
            :multiple="multiple"
            @change="filesChange($event.target.name, $event.target.files)"
          />
        </label>
        <span v-if="uploadedFiles.length > 1" class="file-upload-status">
          {{ uploadedFiles.length }} {{ $tc('main.files_selected') }}
        </span>
        <span v-if="uploadedFiles.length === 1" class="file-upload-status">
          {{ uploadedFiles[0] }}
        </span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    accept: {
      default: '.csv',
      type: String
    },
    isPrimary: {
      default: true,
      type: Boolean
    },
    label: {
      type: String,
      required: true
    },
    multiple: {
      default: false,
      type: Boolean
    },
    uploadFieldName: {
      default: 'file',
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isInitial: true,
      isSaving: false,
      uploadedFiles: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.reset()
    const events = [
      'drag',
      'dragstart',
      'dragend',
      'dragover',
      'dragenter',
      'dragleave',
      'drop'
    ]
    events.forEach((evt) => {
      this.$refs.wrapper.addEventListener(evt, (e) => {
        e.preventDefault()
        e.stopPropagation()
      })
    })
  },
  methods: {
    filesChange(name, files) {
      const forms = []
      for (let i = 0, numFiles = files.length; i < numFiles; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append(this.uploadFieldName, file, file.name)
        forms.push(formData)
        if (this.multiple) {
          this.uploadedFiles.push(file.name)
        } else {
          this.uploadedFiles = [file.name]
        }
      }
      if (this.multiple) {
        this.$emit('fileselected', forms)
      } else {
        this.$emit('fileselected', forms[0])
      }
    },
    reset() {
      this.isSaving = false
      this.isInitial = true
      this.uploadedFiles = []
      this.$refs.uploadInput.value = ''
    },

    onDragover() {
      this.isDragging = true
    },

    onDragleave() {
      this.isDragging = false
    },

    onDrop(event) {
      if (event.dataTransfer.files) {
        this.isDragging = false
        this.isSaving = false
        this.filesChange('file', event.dataTransfer.files)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload-wrapper {
}
.dropbox {
  display: flex;
  align-items: center;
}
.file-upload-status {
  margin-left: 0.5rem;
  font-style: italic;
}
</style>
