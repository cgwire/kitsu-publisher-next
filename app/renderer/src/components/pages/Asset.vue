<template>
  <div class="columns fixed-page asset">
    <div class="page column main-column">
      <div class="page-header flexrow">
        <!--router-link
        class="flexrow-item has-text-centered back-link ml1"
        :to="previousAssetPath"
      >
        <chevron-left-icon />
      </router-link>
      <router-link
        class="flexrow-item has-text-centered back-link"
        :to="nextAssetPath"
      >
        <chevron-right-icon />
      </router-link-->
        <router-link
          class="flexrow-item has-text-centered back-link ml1"
          :to="assetsPath"
        >
          <icon name="chevron-left" />
        </router-link>
        <span class="flexrow-item ml2">
          <entity-thumbnail
            v-if="currentAsset"
            class="entity-thumbnail"
            :entity="currentAsset"
            :empty-width="100"
            :empty-height="60"
            :width="100"
            :with-link="false"
          />
        </span>
        <div class="flexrow-item">
          <page-title
            :text="title"
            class="entity-title"
          />
        </div>
        <div class="filler" />
        <div
          v-if="
            currentAsset &&
              currentAsset.ready_for &&
              currentAsset.ready_for !== 'None'
          "
          class="ready-for flexrow block mr0"
        >
          <span class="flexrow-item">
            {{ $t('assets.fields.ready_for') }}
          </span>
          <task-type-name
            class="flexrow-item"
            :task-type="taskTypeMap.get(currentAsset.ready_for)"
            :current-production-id="currentProduction.id"
          />
        </div>
      </div>

      <div class="flexrow infos">
        <div class="flexrow-item block flexcolumn">
          <page-subtitle :text="$t('assets.tasks')" />
          <entity-task-list
            class="task-list"
            :entries="currentAsset ? currentAsset.tasks : []"
            :is-loading="!currentAsset"
            :is-error="false"
            @task-selected="onTaskSelected"
          />
        </div>
        <div class="flexrow-item block flexcolumn">
          <div class="flexrow">
            <page-subtitle :text="$t('main.info')" />
            <div class="filler" />
            <div class="flexrow-item has-text-right">
              <button-simple
                v-if="isCurrentUserManager"
                icon="edit"
                @click="modals.edit = true"
              />
            </div>
          </div>

          <div class="table-body">
            <table
              v-if="currentAsset"
              class="datatable no-header"
            >
              <tbody class="table-body">
                <tr class="datatable-row">
                  <td class="field-label">
                    {{ $t('assets.fields.description') }}
                  </td>
                  <description-cell
                    :entry="currentAsset"
                    :full="true"
                  />
                </tr>
                <tr
                  v-for="descriptor in assetMetadataDescriptors"
                  :key="descriptor.id"
                  class="datatable-row"
                >
                  <td class="field-label">
                    {{ descriptor.name }}
                  </td>
                  <td>
                    {{
                      currentAsset.data
                        ? currentAsset.data[descriptor.field_name]
                        : ''
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="asset-data block">
        <div class="flexrow">
          <combobox-styled
            v-model="currentSection"
            class="section-combo flexrow-item"
            :options="entityNavOptions"
          />
          <span
            v-show="
              currentSection === 'casting' && currentAsset.is_casting_standby
            "
            class="tag tag-standby"
          >
            {{ $t('breakdown.fields.standby') }}
          </span>
          <div class="filler" />
          <span
            v-show="currentSection === 'schedule'"
            class="flexrow-item mt05"
          >
            {{ $t('schedule.zoom_level') }}:
          </span>
          <combobox-number
            v-show="currentSection === 'schedule'"
            v-model="zoomLevel"
            class="zoom-level flexrow-item"
            :options="zoomOptions"
            is-simple
          />
        </div>

        <div
          v-show="currentSection === 'casting'"
          class="asset-casted-in"
        >
          <div v-if="currentAsset">
            <div
              v-if="
                currentAsset.castInShotsBySequence &&
                  currentAsset.castInShotsBySequence[0].length > 0
              "
            >
              <div
                v-for="sequenceShots in currentAsset.castInShotsBySequence"
                v-if="sequenceShots[0].sequence_name"
                :key="
                  sequenceShots.length > 0 ? sequenceShots[0].sequence_name : ''
                "
                class="sequence-shots"
              >
                <div class="shot-sequence">
                  {{
                    sequenceShots.length > 0
                      ? sequenceShots[0].sequence_name
                      : ''
                  }}
                </div>
                <div class="shot-list">
                  <router-link
                    v-for="shot in sequenceShots"
                    :key="shot.shot_id"
                    class="shot-link"
                    :to="shotPath(shot)"
                  >
                    <entity-thumbnail
                      class="entity-thumbnail"
                      :entity="shot"
                      :square="true"
                      :empty-width="103"
                      :empty-height="103"
                      :with-link="false"
                    />
                    <div>
                      <span>{{ shot.shot_name }}</span>
                      <span v-if="shot.nb_occurences > 1">
                        ({{ shot.nb_occurences }})
                      </span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
            <div v-else>
              {{ $t('assets.no_cast_in') }}
            </div>
          </div>
          <table-info
            v-else
            :is-loading="castIn.isLoadin"
            :is-error="castIn.isError"
          />

          <div
            v-if="
              currentAsset &&
                currentAsset.castingAssetsByType &&
                currentAsset.castingAssetsByType[0].length > 0
            "
          >
            <page-subtitle text="Linked" />
            <div
              v-if="
                currentAsset.castingAssetsByType &&
                  currentAsset.castingAssetsByType[0].length > 0
              "
            >
              <div
                v-for="typeAssets in currentAsset.castingAssetsByType"
                :key="
                  typeAssets.length > 0 ? typeAssets[0].asset_type_name : ''
                "
                class="type-assets"
              >
                <div class="asset-type">
                  {{
                    typeAssets.length > 0 ? typeAssets[0].asset_type_name : ''
                  }}
                  ({{ typeAssets.length }})
                </div>
                <div class="asset-list">
                  <router-link
                    v-for="asset in typeAssets"
                    :key="asset.id"
                    class="asset-link"
                    :to="{
                      name: 'asset',
                      params: {
                        production_id: currentProduction.id,
                        asset_id: asset.asset_id
                      }
                    }"
                  >
                    <entity-thumbnail
                      class="entity-thumbnail"
                      :entity="asset"
                      :square="true"
                      :empty-width="103"
                      :empty-height="103"
                      :with-link="false"
                    />
                    <div>
                      <span>{{ asset.asset_name }}</span>
                      <span v-if="asset.nb_occurences > 1">
                        ({{ asset.nb_occurences }})
                      </span>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="scheduleItems[0].children.length > 0"
          v-show="currentSection === 'schedule'"
          class="schedule mt1"
        >
          <div class="wrapper">
            <schedule
              ref="schedule-widget"
              :start-date="tasksStartDate"
              :end-date="tasksEndDate"
              :hierarchy="scheduleItems"
              :zoom-level="zoomLevel"
              :is-loading="false"
              :is-estimation-linked="true"
              :hide-root="true"
              :with-milestones="false"
            />
          </div>
        </div>

        <entity-preview-files
          v-if="currentSection === 'preview-files'"
          :entity="currentAsset"
        />

        <entity-news
          v-if="currentSection === 'activity'"
          :entity="currentAsset"
        />

        <entity-time-logs
          v-if="currentSection === 'time-logs'"
          :entity="currentAsset"
        />
      </div>
    </div>

    <div
      v-if="currentTask"
      class="column side-column"
    >
      <task-info :task="currentTask" />
    </div>

    <edit-asset-modal
      ref="edit-asset-modal"
      :active="modals.edit"
      :is-loading="loading.edit"
      :is-error="errors.edit"
      :asset-to-edit="currentAsset"
      @cancel="modals.edit = false"
      @confirm="confirmEditAsset"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { entityMixin } from '@/components/mixins/entity'
import { formatListMixin } from '@/components/mixins/format'

import ButtonSimple from '@/components/widgets/ButtonSimple'
import ComboboxNumber from '@/components/widgets/ComboboxNumber'
import ComboboxStyled from '@/components/widgets/ComboboxStyled'
import DescriptionCell from '@/components/cells/DescriptionCell'
import EditAssetModal from '@/components/modals/EditAssetModal'
import EntityNews from '@/components/pages/entities/EntityNews'
import EntityPreviewFiles from '@/components/pages/entities/EntityPreviewFiles'
import EntityTimeLogs from '@/components/pages/entities/EntityTimeLogs'
import EntityTaskList from '@/components/lists/EntityTaskList'
import EntityThumbnail from '@/components/widgets/EntityThumbnail'
import Icon from '@/components/widgets/Icon'
import PageTitle from '@/components/widgets/PageTitle'
import PageSubtitle from '@/components/widgets/PageSubtitle'
import Schedule from '@/components/pages/schedule/Schedule'
import TableInfo from '@/components/widgets/TableInfo'
import TaskTypeName from '@/components/widgets/TaskTypeName'
import TaskInfo from '@/components/sides/TaskInfo'

export default {
  name: 'Asset',
  mixins: [entityMixin, formatListMixin],
  components: {
    ButtonSimple,
    ComboboxNumber,
    ComboboxStyled,
    DescriptionCell,
    EditAssetModal,
    EntityNews,
    EntityPreviewFiles,
    EntityThumbnail,
    EntityTaskList,
    EntityTimeLogs,
    Icon,
    PageSubtitle,
    PageTitle,
    Schedule,
    TableInfo,
    TaskInfo,
    TaskTypeName
  },

  data() {
    return {
      currentAsset: null,
      currentTask: null,
      castIn: {
        isLoading: false,
        isError: false
      },
      errors: {
        edit: false
      },
      loading: {
        edit: false
      },
      modals: {
        edit: false,
        preview: false
      }
    }
  },

  mounted() {
    this.clearSelectedTasks()
    this.init()
  },

  computed: {
    ...mapGetters([
      'assetMap',
      'assetSearchText',
      'assetMetadataDescriptors',
      'currentEpisode',
      'currentProduction',
      'getTaskTypePriority',
      'isTVShow',
      'isCurrentUserManager',
      'route',
      'taskMap',
      'taskTypeMap',
      'shotId'
    ]),

    title() {
      if (this.currentAsset) {
        return (
          `${this.currentAsset.asset_type_name} / ` +
          `${this.currentAsset.name}`
        )
      } else {
        return 'Loading...'
      }
    },

    assetThumbnailPath() {
      const previewId = this.currentAsset.preview_file_id
      return `${this.$store.state.login.server}/api/pictures/originals/preview-files/${previewId}.png`
    },

    isPreview() {
      return (
        this.currentAsset &&
        this.currentAsset.preview_file_id &&
        this.currentAsset.preview_file_id.length > 0
      )
    },

    previousAssetPath() {
      const assets = Array.from(this.assetMap.values())
      if (assets.length === 0) return { name: 'open-productions' }
      const currentIndex = assets.findIndex((asset) => {
        return asset && this.currentAsset && asset.id === this.currentAsset.id
      })
      const index = currentIndex !== 0 ? currentIndex - 1 : assets.length - 1
      const asset = assets[index]
      if (!asset) return { name: 'open-productions' }
      const route = {
        name: 'asset',
        params: {
          production_id: this.currentProduction.id,
          asset_id: asset.id
        },
        query: {
          search: ''
        }
      }
      if (this.currentEpisode) {
        route.name = 'episode-asset'
        route.params.episode_id = this.currentEpisode.id
      }
      return route
    },

    nextAssetPath() {
      const assets = Array.from(this.assetMap.values())
      if (assets.length === 0) return { name: 'open-productions' }
      const currentIndex = assets.findIndex((asset) => {
        return asset && this.currentAsset && asset.id === this.currentAsset.id
      })
      const index = currentIndex === assets.length - 1 ? 0 : currentIndex + 1
      const asset = assets[index]
      if (!asset) return { name: 'open-productions' }
      const route = {
        name: 'asset',
        params: {
          production_id: this.currentProduction.id,
          asset_id: asset.id
        },
        query: {
          search: ''
        }
      }
      if (this.currentEpisode) {
        route.name = 'episode-asset'
        route.params.episode_id = this.currentEpisode.id
      }
      return route
    },

    assetsPath() {
      const route = {
        name: 'assets',
        params: {
          production_id: this.currentProduction.id
        },
        query: {
          search: this.assetSearchText || ''
        }
      }
      if (this.currentEpisode) {
        route.name = 'episode-assets'
        route.params.episode_id = this.currentEpisode.id
      }
      return route
    }
  },

  methods: {
    ...mapActions([
      'clearSelectedTasks',
      'editAsset',
      'loadAsset',
      'loadAssets',
      'loadAssetCastIn',
      'loadAssetCasting',
      'loadShots',
      'setCurrentEpisode'
    ]),

    changeTab(tab) {
      this.selectedTab = tab
    },

    getCurrentAsset() {
      return new Promise((resolve, reject) => {
        const assetId = this.route.params.asset_id
        if (!assetId) resolve(null)
        const asset = this.assetMap.get(assetId) || null
        if (!asset) {
          if (assetId) {
            return this.loadAsset(assetId).then(resolve)
          }
        } else {
          return resolve(asset)
        }
      })
    },

    onEditClicked() {
      this.modals.edit = true
    },

    confirmEditAsset(form) {
      form.id = this.currentAsset.id
      this.loading.edit = true
      this.errors.edit = false
      this.editAsset(form)
        .then(() => {
          this.loading.edit = false
          this.modals.edit = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.edit = false
          this.errors.edit = true
        })
    },

    resetData() {
      this.castIn.isLoading = true
      if (this.$route.params.episode_id === 'main') {
        this.setCurrentEpisode('main')
      }
      // Next tick is needed to wait for the episode change.
      this.$nextTick(() => {
        this.getCurrentAsset()
          .then((asset) => {
            this.currentAsset = asset
            return this.loadAssetCastIn(this.currentAsset)
          })
          .then(() => this.loadAssetCasting(this.currentAsset))
          .then(() => {
            this.castIn.isLoading = false
          })
          .catch((err) => {
            this.castIn.isError = true
            this.castIn.isLoading = false
            console.error(err)
          })
      })
    },

    shotPath(shot) {
      return {
        name: shot.episode_id ? 'episode-shot' : 'shot',
        params: {
          production_id: this.currentProduction.id,
          shot_id: shot.shot_id,
          episode_id: shot.episode_id ? shot.episode_id : undefined
        }
      }
    },

    init() {
      this.getCurrentAsset()
        .then((asset) => {
          this.currentAsset = asset
          this.currentSection = this.route.query.section || 'casting'
          this.castIn.isLoading = true
          this.castIn.isError = false
          if (this.currentAsset) {
            this.loadAssetCastIn(this.currentAsset)
              .then(() => this.loadAssetCasting(this.currentAsset))
              .then(() => {
                this.castIn.isLoading = false
              })
              .catch((err) => {
                this.castIn.isLoading = false
                this.castIn.isError = true
                console.error(err)
              })
          } else {
            this.resetData()
          }
        })
        .catch(console.error)
    }
  },

  watch: {
    $route() {
      this.init()
    }
  },

  metaInfo() {
    return {
      title: `${this.title} - Kitsu`
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .page {
    padding-bottom: 1em;
  }

  .task-list,
  .table-body {
    border: 1px solid $dark-grey;
  }

  .wrapper {
    background: $dark-grey-2;
  }
}

.main-column {
  display: flex;
  flex-direction: column;
  background: var(--background-page);
  padding-bottom: 1em;
}

h2.subtitle {
  border-bottom: 0;
  margin-top: 0;
  margin-bottom: 0.5em;
  font-size: 1.5em;
}

.page-header {
  margin-top: calc(50px + 2em);
  margin-bottom: 0.8em;
  margin-left: 1em;
  margin-right: 1em;
  .entity-title {
    font-weight: 500;
  }
}

.infos {
  height: 300px;
  margin-bottom: 1em;
  margin-left: 1em;
  margin-right: 1em;

  .flexrow-item {
    align-self: flex-start;
    height: 100%;
    flex: 1;
  }
}

.asset-data {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 1em 0 1em;
  max-height: 100%;
  overflow: hidden;
}

.asset-casting,
.asset-casted-in {
  overflow-y: auto;
  margin-top: 1em;
}

.thumbnail-picture {
  margin-bottom: 0.5em;
}

.sequence-shots {
  margin-bottom: 3em;
}

.asset-type,
.shot-sequence {
  text-transform: uppercase;
  font-size: 1.2em;
  color: var(--text);
  margin-top: 2em;
  margin-bottom: 0.4em;
}

.asset-list,
.shot-list {
  color: var(--text);
  display: flex;
  flex-wrap: wrap;
}

.asset-link,
.shot-link {
  color: inherit;
  margin-right: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8em;
}

.asset-link div,
.shot-link div {
  max-width: 100px;
}

.asset-link span,
.shot-link span {
  word-wrap: break-word;
}

.field-label {
  font-weight: bold;
  width: 120px;
}

.page-header {
  align-items: center;
}

.back-link {
  padding-top: 3px;
}

.task-list {
  max-width: 100%;
}

.datatable-row {
  user-select: text;
}

.schedule {
  position: relative;
  height: 100%;

  .timelien-wrapper,
  .timeline {
    height: 100%;
  }

  .schedule-title {
    margin-bottom: 5px;
  }

  .wrapper {
    height: 100%;
    border-radius: 10px;
  }
}

.section-combo {
  width: 150px;

  .option-line {
    width: 150px;
  }
}

.entity-thumbnail {
  margin-bottom: 0;
}

@media screen and (max-width: 768px) {
  .task-column {
    margin-bottom: 1em;
  }

  .column:first-child {
    margin-right: 0;
  }

  .entity-title {
    font-size: 1.3em;
    line-height: 1.5em;
  }
}

.tag-standby {
  background: $red;
  color: $white;
  cursor: default;
  text-transform: uppercase;
}

.dark .tag-standby {
  background: $dark-red;
}
</style>
