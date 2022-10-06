<template>
  <div class="mt1 flexcolumn wrapper preview-files">
    <div
      v-if="isLoading"
      class="has-text-centered"
    >
      <spinner />
    </div>
    <div v-else-if="previewFiles.length > 0">
      <table class="datatable">
        <thead class="datatable-head">
          <tr class="datatable-row-header">
            <th class="thumbnail" />
            <th class="type">
              {{ $t('entities.preview_files.task_type') }}
            </th>
            <th class="revision">
              {{ $t('entities.preview_files.revision') }}
            </th>
            <th class="original-name">
              {{ $t('entities.preview_files.original_file_name') }}
            </th>
            <th class="extension">
              {{ $t('entities.preview_files.extension') }}
            </th>
            <th class="size">
              {{ $t('entities.preview_files.size') }}
            </th>
            <th class="status">
              {{ $t('entities.preview_files.status') }}
            </th>
            <th class="uploader">
              {{ $t('entities.preview_files.uploader') }}
            </th>
            <th class="person" />
            <th class="end-cell" />
          </tr>
        </thead>
      </table>
      <table
        class="datatable"
        style="overflow: auto"
      >
        <tbody class="datatable-body">
          <tr
            v-for="previewFile in previewFiles"
            :key="previewFile.id"
            class="datatable-row"
          >
            <td class="thumbnail">
              <entity-thumbnail
                class="preview-thumbnail"
                :preview-file-id="previewFile.id"
                :empty-width="60"
                :width="60"
              />
            </td>

            <task-type-name
              class="type"
              :task-type="getTaskType(previewFile)"
              :production-id="currentProduction.id"
            />
            <td class="revision">
              {{ previewFile.revision }}
            </td>
            <td class="original-name">
              {{ previewFile.original_name }}
            </td>
            <td class="extension">
              {{ previewFile.extension }}
            </td>
            <td class="size">
              {{ renderFileSize(previewFile.file_size) }}
            </td>
            <td class="status">
              {{ previewFile.validation_status }}
            </td>

            <people-name-cell
              class="person"
              :person="personMap.get(previewFile.person_id)"
            />
            <td class="download">
              <a
                class="button flexrow-item"
                :href="getDownloadPath(previewFile.id)"
                :title="$t('playlists.actions.download_file')"
              >
                <icon
                  name="download"
                  :width="20"
                  class="is-small"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      {{ $t('entities.preview_files.no_preview_files') }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Icon from '@/components/widgets/Icon'
import { renderFileSize } from '@/lib/render'
import EntityThumbnail from '@/components/widgets/EntityThumbnail'
import PeopleNameCell from '@/components/cells/PeopleNameCell'
import Spinner from '@/components/widgets/Spinner'
import TaskTypeName from '@/components/cells/TaskTypeName'

export default {
  name: 'EntityPreviewFiles',
  components: {
    EntityThumbnail,
    Icon,
    PeopleNameCell,
    Spinner,
    TaskTypeName
  },

  data() {
    return {
      isLoading: false,
      previewFiles: []
    }
  },

  props: {
    entity: {
      type: Object,
      default: () => {}
    }
  },

  mounted() {
    if (!this.entity) return
    this.reset()
  },

  computed: {
    ...mapGetters(['currentProduction', 'personMap', 'taskMap', 'taskTypeMap'])
  },

  methods: {
    ...mapActions(['getEntityPreviewFiles']),

    getTaskType(previewFile) {
      const task = this.taskMap.get(previewFile.task_id)
      return this.taskTypeMap.get(task.task_type_id)
    },

    getDownloadPath(previewFileId) {
      const type = this.isMovie ? 'movies' : 'pictures'
      return (
        `/api/${type}/originals/preview-files/` + `${previewFileId}/download`
      )
    },

    renderFileSize,

    reset() {
      this.isLoading = true
      this.getEntityPreviewFiles(this.entity.id)
        .then((previewFiles) => {
          this.previewFiles = previewFiles
          this.isLoading = false
        })
        .catch((err) => {
          console.error(err)
          this.previewFiles = []
          this.isLoading = false
        })
    }
  },

  watch: {
    entity() {
      if (this.entity) this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.datatable-body {
  overflow-y: auto;
}

.thumbnail {
  padding-top: 10px;
  width: 80px;
}
.type {
  width: 150px;
}
.revision {
  width: 80px;
}
.original-name {
  width: 300px;
}
.extension {
  width: 80px;
}
.size {
  width: 50px;
}
.status {
  width: 80px;
}
.download {
  width: 40px;
}

.preview-files {
  overflow-y: auto;
}
.dark .preview-files.wrapper {
  background: transparent;
}

.preview-thumbnail {
  cursor: pointer;
  border-radius: 4px;
}

.datatable-row-header::after {
  display: none;
}
</style>
