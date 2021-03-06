<template>
  <div
    v-if="task"
    ref="side-panel"
    class="side task-info"
  >
    <div class="page-header">
      <div class="flexrow header-title">
        <div class="title flexrow-item">
          {{ task ? title : 'Loading...' }}
        </div>
        <task-type-name
          v-if="currentTaskType"
          class="flexrow-item task-type"
          :task-type="currentTaskType"
          :production-id="currentProduction.id"
        />
      </div>
      <div class="flexrow task-information">
        <!-- TODO : reactivate change-wideness-button
        <button-simple
          v-if="isExtraWide && isPreview"
          class="flexrow-item change-wideness-button"
          icon="right"
          :title="$t('tasks.smaller')"
          @click="toggleExtraWidth"
        />
        <button-simple
          v-else-if="isWide && isPreview"
          class="flexrow-item change-wideness-button"
          icon="left"
          :title="$t('tasks.bigger')"
          @click="toggleExtraWidth"
        />
        <button-simple
          v-if="isWide && !isExtraWide && isPreview"
          class="flexrow-item change-wideness-button"
          icon="right"
          :title="$t('tasks.smaller')"
          @click="toggleWidth"
        />
        <button-simple
          v-else-if="!isExtraWide && isPreview"
          class="flexrow-item change-wideness-button"
          icon="left"
          :title="$t('tasks.bigger')"
          @click="toggleWidth"
        />
        -->
        <!-- TODO : reactivate set-thumbnail-button
        <button-simple
          v-if="isCurrentUserManager && isPreview && extension !== 'gif'"
          class="flexrow-item set-thumbnail-button"
          icon="image"
          :title="$t('tasks.set_preview')"
          @click="setCurrentPreviewAsEntityThumbnail"
        />-->
        <subscribe-button
          v-if="!isAssigned"
          class="flexrow-item"
          :subscribed="isAssigned || isSubscribed"
          @click="toggleSubscribe"
        />
        <div class="filler" />
        <div
          v-if="isPreview"
          class="preview-list flexrow"
        >
          <span
            v-for="(preview, index) in lastFivePreviews"
            :key="'preview-' + preview.id"
            :class="{
              'flexrow-item': true,
              selected: currentPreviewIndex === index
            }"
            @click="onPreviewChanged(index)"
          >
            {{ preview.revision }}
          </span>
        </div>
      </div>
    </div>

    <div
      ref="task-columns"
      class="task-columns"
    >
      <div
        v-if="isPreview"
        class="task-column preview-column"
      >
        <div class="preview-column-content">
          <div class="preview">
            <div v-if="taskPreviews && taskPreviews.length > 0">
              <preview-player
                ref="preview-player"
                :entity-preview-files="taskEntityPreviews"
                :last-preview-files="lastFivePreviews"
                :previews="currentPreview ? currentPreview.previews : []"
                :task-type-map="taskTypeMap"
                :light="!isWide"
                :read-only="!isCurrentUserManager"
                :is-assigned="isAssigned"
                :task="task"
                :extra-wide="isExtraWide"
                @add-extra-preview="onAddExtraPreview"
                @annotation-changed="onAnnotationChanged"
                @change-current-preview="changeCurrentPreview"
                @comment-added="onCommentAdded"
                @remove-extra-preview="onRemoveExtraPreview"
                @time-updated="onTimeUpdated"
              />
            </div>

            <div
              v-if="!taskPreviews || taskPreviews.length === 0"
              class="no-preview"
            >
              <em>{{ $t('tasks.no_preview') }}</em>
            </div>
          </div>
        </div>
      </div>

      <div class="task-column">
        <article class="time-spent">
          <div class="flexrow">
            <date-field
              v-model="selectedDate"
              class="flexrow-item"
              :disabled-dates="disabledDates"
              :can-delete="false"
              :with-margin="false"
            />
            <h1 class="title flexrow-item">
              {{ $t('timesheets.time_spents') }}
            </h1>
          </div>
          <div class="flexrow">
            <div>
              <span class="slider-infos flexrow-item">
                {{ durationValue }}
              </span>
            </div>
            <div class="slider-flex flexrow-item">
              <slider
                v-model="durationValue"
                v-bind="sliderConfiguration"
                class="slider slider-green"
              />
            </div>
          </div>
        </article>
      </div>

      <div class="task-column comments-column">
        <div>
          <div>
            <add-comment
              v-if="isCommentingAllowed"
              ref="add-comment"
              :user="user"
              :team="currentTeam"
              :task="task"
              :task-status="getTaskStatusForCurrentUser(task.project_id)"
              :light="true"
              :is-loading="loading.addComment"
              :attached-file-name="attachedFileName"
              :is-error="errors.addComment"
              :fps="parseInt(currentFps)"
              :time="isPreview ? currentTime : currentTimeRaw"
              :revision="currentRevision"
              :is-movie="isMoviePreview"
              @add-comment="addComment"
              @add-preview="onAddPreviewClicked"
              @file-drop="selectFile"
              @annotation-snapshots-requested="extractAnnotationSnapshots"
            />

            <div
              v-if="taskComments && taskComments.length > 0 && !loading.task"
              class="comments"
            >
              <comment
                v-for="(comment, index) in taskComments"
                :key="'comment' + comment.id"
                :comment="comment"
                :task="task"
                :light="true"
                :add-preview="onAddPreviewClicked"
                :is-first="index === 0"
                :is-last="index === pinnedCount"
                :is-change="isStatusChange(index)"
                :editable="
                  (comment.person && user.id === comment.person.id) ||
                    isCurrentUserAdmin
                "
                @duplicate-comment="onDuplicateComment"
                @pin-comment="onPinComment"
                @edit-comment="onEditComment"
                @delete-comment="onDeleteComment"
                @checklist-updated="saveComment"
                @ack-comment="onAckComment"
                @time-code-clicked="timeCodeClicked"
              />
            </div>
            <div
              v-else-if="!loading.task"
              class="no-comment"
            >
              <em>
                {{ $t('tasks.no_comment') }}
              </em>
            </div>
          </div>
        </div>

        <div
          v-if="loading.task"
          class="has-text-centered"
        >
          <spinner />
        </div>
      </div>
    </div>

    <add-preview-modal
      ref="add-preview-modal"
      :active="modals.addPreview"
      :is-loading="loading.addPreview"
      :is-error="errors.addPreview"
      :current-task="task"
      @cancel="onClosePreview"
      @fileselected="selectFile"
      @confirm="onClosePreview"
    />

    <add-preview-modal
      ref="add-extra-preview-modal"
      :active="modals.addExtraPreview"
      :is-loading="loading.addExtraPreview"
      :is-error="errors.addExtraPreview"
      :form-data="addExtraPreviewFormData"
      :current-task="task"
      extensions=".png,.jpg,.jpeg"
      @cancel="onCloseExtraPreview"
      @fileselected="selectFile"
      @confirm="createExtraPreview"
    />

    <edit-comment-modal
      :active="modals.editComment"
      :is-loading="loading.editComment"
      :is-error="errors.editComment"
      :comment-to-edit="commentToEdit"
      :team="currentTeam"
      @confirm="confirmEditTaskComment"
      @cancel="onCancelEditComment"
    />

    <delete-modal
      :active="modals.deleteComment"
      :is-loading="loading.deleteComment"
      :is-error="errors.deleteComment"
      :text="$t('tasks.delete_comment')"
      :error-text="$t('tasks.delete_comment_error')"
      @confirm="confirmDeleteTaskComment"
      @cancel="onCancelDeleteComment"
    />

    <delete-modal
      :active="modals.deleteExtraPreview"
      :is-loading="loading.deleteExtraPreview"
      :is-error="errors.deleteExtraPreview"
      :text="$t('tasks.delete_preview')"
      :error-text="$t('tasks.delete_preview_error')"
      @cancel="onCancelRemoveExtraPreview"
      @confirm="confirmDeleteTaskPreview"
    />
  </div>

  <div
    v-else
    class="side task-info has-text-centered"
  >
    {{ $t('tasks.no_task_selected') }}
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getTaskEntityPath, getTaskPath } from '@/lib/path'
import { getTaskTypeStyle } from '@/lib/render'
import moment from 'moment-timezone'
import peopleApi from '@/store/api/people'

import AddComment from '@/components/widgets/AddComment'
import AddPreviewModal from '@/components/modals/AddPreviewModal'
import Comment from '@/components/widgets/Comment'
import DeleteModal from '@/components/modals/DeleteModal'
import EditCommentModal from '@/components/modals/EditCommentModal'
import Spinner from '@/components/widgets/Spinner'
import SubscribeButton from '@/components/widgets/SubscribeButton'
import TaskTypeName from '@/components/widgets/TaskTypeName'
import PreviewPlayer from '@/components/previews/PreviewPlayer'
import Slider from '@vueform/slider'
import DateField from '@/components/widgets/DateField'
import '@vueform/slider/themes/default.css'

export default {
  name: 'TaskInfo',
  components: {
    AddComment,
    AddPreviewModal,
    Comment,
    DateField,
    DeleteModal,
    EditCommentModal,
    PreviewPlayer,
    Spinner,
    SubscribeButton,
    TaskTypeName,
    Slider
  },

  props: {
    task: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    isPreview: {
      type: Boolean,
      default: true
    },
    currentTimeRaw: {
      type: Number,
      default: 0
    },
    currentParentPreview: {
      type: Object,
      default: null
    },
    silent: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      durationValue: 0,
      updatedDurationValue: true,
      selectedDate: moment().toDate(),
      disabledDates: {},
      addExtraPreviewFormData: null,
      attachedFileName: '',
      attachedImage: '',
      currentPreviewIndex: 0,
      currentPreviewPath: '',
      currentPreviewDlPath: '',
      currentTime: 0,
      commentToEdit: null,
      isSubscribed: false,
      isWide: false,
      isExtraWide: false,
      otherPreviews: [],
      taskComments: [],
      taskPreviews: [],
      errors: {
        addComment: false,
        addPreview: false,
        addExtraPreview: false,
        editComment: false,
        deleteComment: false,
        confirmDeleteTaskPreview: false,
        task: false
      },
      loading: {
        addComment: false,
        addPreview: false,
        addExtraPreview: false,
        editComment: false,
        deleteComment: false,
        confirmDeleteTaskPreview: false,
        task: false
      },
      modals: {
        addPreview: false,
        addExtraPreview: false,
        editComment: false,
        deleteComment: false,
        deleteExtraPreview: false
      },
      sliderConfiguration: {
        min: 0,
        max: 10,
        step: 0.25,
        lazy: true,
        tooltipPosition: 'bottom',
        showTooltip: 'drag',
        format: (value) => `${value}`
      }
    }
  },

  mounted() {
    this.loadTaskData()
    if (this.$refs['add-comment']) {
      this.$refs['add-comment'].text = this.lastCommentDraft
    }
    const beginningOfTheWeek = moment().startOf('isoWeek').toDate()
    this.disabledDates = {
      to:
        this.isCurrentUserArtist &&
        this.organisation.timesheets_locked === 'true'
          ? beginningOfTheWeek
          : undefined,
      from: moment().toDate() // Disable dates after today.
    }
  },

  beforeUnmount() {
    if (this.$refs['add-comment']) {
      const lastComment = `${this.$refs['add-comment'].text}`
      this.$store.commit('SET_LAST_COMMENT_DRAFT', lastComment)
    }
  },

  computed: {
    ...mapGetters([
      'currentEpisode',
      'currentProduction',
      'getTaskComment',
      'getTaskComments',
      'getTaskPreviews',
      'getTaskStatusForCurrentUser',
      'isCurrentUserAdmin',
      'isCurrentUserClient',
      'isCurrentUserManager',
      'isSingleEpisode',
      'isTVShow',
      'lastCommentDraft',
      'organisation',
      'personMap',
      'previewFormData',
      'productionMap',
      'taskEntityPreviews',
      'taskTypeMap',
      'user'
    ]),

    currentTeam() {
      if (!this.task) return []
      const production = this.productionMap.get(this.task.project_id)
      return production.team.map((id) => this.personMap.get(id))
    },

    title() {
      if (this.task) {
        const entityName = this.task.full_entity_name || this.task.entity_name
        return `${entityName}`
      } else {
        return 'Loading...'
      }
    },

    isAssigned() {
      if (this.task) {
        return this.task.assignees.some((assigneeId) => {
          return assigneeId === this.user.id
        })
      } else {
        return false
      }
    },

    isCommentingAllowed() {
      if (!this.task) return false
      const isManager = this.isCurrentUserManager
      const isAssigned = this.task.assignees.find(
        (personId) => personId === this.user.id
      )
      const isClient = this.isCurrentUserClient
      return isManager || isAssigned || isClient
    },

    isSetThumbnailAllowed() {
      return (
        this.currentPreviewId &&
        this.task &&
        this.task.entity &&
        this.currentPreviewId !== this.task.entity.preview_file_id &&
        this.extension !== 'gif'
      )
    },

    currentTaskType() {
      return this.task ? this.taskTypeMap.get(this.task.task_type_id) : null
    },

    currentPreview() {
      const index = this.currentPreviewIndex
      return this.taskPreviews && this.taskPreviews.length > 0
        ? this.taskPreviews[index]
        : null
    },

    currentPreviewId() {
      const index = this.currentPreviewIndex
      if (
        this.taskPreviews &&
        this.taskPreviews.length > 0 &&
        this.taskPreviews[index]
      ) {
        return this.taskPreviews[index].id
      } else {
        return null
      }
    },

    currentFps() {
      return this.productionMap.get(this.task.project_id).fps || '25'
    },

    currentRevision() {
      return this.currentParentPreview && this.currentParentPreview.revision
        ? this.currentParentPreview.revision
        : this.currentPreview
        ? this.currentPreview.revision
        : 0
    },

    extension() {
      const index = this.currentPreviewIndex
      return this.taskPreviews && this.taskPreviews.length > 0
        ? this.taskPreviews[index].extension
        : ''
    },

    isStandardPreview() {
      return (
        this.taskPreviews &&
        this.taskPreviews.length > 0 &&
        [
          'ai',
          'blend',
          'ma',
          'mb',
          'pdf',
          'psd',
          'rar',
          'ae',
          'fla',
          'flv',
          'swf',
          'zip'
        ].includes(this.extension)
      )
    },

    isMoviePreview() {
      return (
        this.taskPreviews &&
        this.taskPreviews.length > 0 &&
        this.extension === 'mp4'
      )
    },

    isPicturePreview() {
      return (
        this.taskPreviews &&
        this.taskPreviews.length > 0 &&
        ['png', 'gif'].includes(this.extension)
      )
    },

    is3DModelPreview() {
      return (
        this.taskPreviews &&
        this.taskPreviews.length > 0 &&
        this.extension === 'obj'
      )
    },

    moviePath() {
      let previewId = null
      previewId = this.currentPreview.id
      return `${this.$store.state.login.server}/api/movies/originals/preview-files/${previewId}.mp4`
    },

    tasktypeStyle() {
      return getTaskTypeStyle(this.task)
    },

    taskPath() {
      return getTaskPath(
        this.task,
        this.currentProduction,
        this.isTVShow,
        this.currentEpisode,
        this.taskTypeMap
      )
    },

    taskEntityPath() {
      const episodeId = this.$route.params.episode_id
      return getTaskEntityPath(this.task, episodeId)
    },

    lastFivePreviews() {
      if (this.taskPreviews) {
        return this.taskPreviews.slice(0, 5)
      } else {
        return []
      }
    },

    pinnedCount() {
      if (!this.taskComments) return 0
      return this.taskComments.filter((c) => c.pinned).length
    },

    previewPlayer() {
      return this.$refs['preview-player']
    }
  },

  methods: {
    ...mapActions([
      'ackComment',
      'addCommentExtraPreview',
      'commentTask',
      'commentTaskWithPreview',
      'deleteTaskComment',
      'deleteTaskPreview',
      'editTaskComment',
      'loadPreviewFileFormData',
      'loadTask',
      'loadTaskComments',
      'loadTaskSubscribed',
      'refreshPreview',
      'pinComment',
      'refreshComment',
      'setPreview',
      'subscribeToTask',
      'unsubscribeFromTask',
      'updatePreviewAnnotation'
    ]),

    loadTaskData() {
      if (this.task) {
        this.loading.task = true
        this.errors.task = false
        this.loadTaskComments({
          taskId: this.task.id,
          entityId: this.task.entity_id
        })
          .then(() => this.loadTaskSubscribed({ taskId: this.task.id }))
          .then((subscribed) => {
            this.loading.task = false
            this.reset()
            this.isSubscribed = subscribed
          })
          .catch((err) => {
            console.error(err)
            this.errors.task = true
          })
        this.updateDurationValue()
      }
    },

    addComment(comment, attachment, checklist, taskStatusId) {
      let preview = this.currentParentPreview
        ? this.currentParentPreview
        : this.currentPreview
      // find real preview, which contains the `revision`
      preview = this.taskPreviews.find((p) => p.id === preview.id)
      const params = {
        taskId: this.task.id,
        taskStatusId,
        attachment,
        checklist,
        comment
      }
      let action = 'commentTask'
      if (this.attachedFileName) action = 'commentTaskWithPreview'
      this.loading.addComment = true
      this.errors.addComment = false
      this.$store
        .dispatch(action, params)
        .then(() => {
          this.$refs['add-preview-modal'].reset()
          if (this.$refs['add-comment-image-modal']) {
            this.$refs['add-comment-image-modal'].reset()
          }
          this.reset()
          this.attachedFileName = ''
          this.loading.addComment = false
          this.$emit('comment-added')
        })
        .catch((err) => {
          console.error(err)
          this.errors.addComment = true
          this.loading.addComment = false
        })
    },

    reset() {
      if (this.task) {
        this.taskComments = this.getTaskComments(this.task.id)
        this.taskPreviews = this.getTaskPreviews(this.task.id)
        this.setOtherPreviews()
        this.currentPreviewPath = this.getOriginalPath()
        this.currentPreviewDlPath = this.getOriginalDlPath()
        this.$nextTick(() => {
          if (this.$refs['add-comment']) this.$refs['add-comment'].focus()
        })
      }
    },

    focusCommentTextarea() {
      if (this.$refs['add-comment']) this.$refs['add-comment'].focus()
    },

    getOriginalPath() {
      const previewId = this.currentPreviewId
      const extension = this.extension ? this.extension : 'png'
      return `${this.$store.state.login.server}/api/pictures/originals/preview-files/${previewId}.${extension}`
    },

    getOriginalDlPath() {
      const previewId = this.currentPreviewId
      return `${this.$store.state.login.server}/api/pictures/originals/preview-files/${previewId}/download`
    },

    setOtherPreviews() {
      if (this.taskPreviews) {
        this.otherPreviews = this.taskPreviews.filter((p) => {
          return p.id !== this.currentPreviewId && p.extension === 'mp4'
        })
      }
      return this.otherPreviews
    },

    selectFile(forms) {
      this.loadPreviewFileFormData(forms)
      this.attachedFileName = forms
        .map((form) => form.get('file').name)
        .join(', ')
    },

    createExtraPreview() {
      const index = this.currentPreviewIndex
      this.errors.addExtraPreview = false
      this.loading.addExtraPreview = true
      this.addCommentExtraPreview({
        taskId: this.task.id,
        commentId: this.taskComments[0].id,
        previewId: this.taskPreviews[index].id
      })
        .then(() => {
          this.loading.addExtraPreview = false
          this.$refs['add-extra-preview-modal'].reset()
          this.reset()
          setTimeout(() => {
            this.$refs['preview-player'].displayLast()
          }, 0)
          this.modals.addExtraPreview = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.addExtraPreview = false
          this.errors.addExtraPreview = true
        })
    },

    onPreviewAdded(eventData) {
      const taskId = eventData.task_id
      const commentId = eventData.comment_id
      const previewId = eventData.preview_file_id
      const revision = eventData.revision
      const extension = eventData.extension
      const comment = this.getTaskComment(taskId, commentId)

      if (this.task) {
        if (
          taskId === this.task.id &&
          comment &&
          (comment.previews.length === 0 ||
            comment.previews[0].id !== previewId)
        ) {
          this.$store.commit('ADD_PREVIEW_END', {
            preview: {
              id: previewId,
              revision,
              extension: extension
            },
            taskId,
            commentId,
            comment
          })
          this.reset()
        }
      }
    },

    onAnnotationChanged({ preview, additions, deletions, updates }) {
      const taskId = this.task.id
      this.updatePreviewAnnotation({
        taskId,
        preview,
        additions,
        deletions,
        updates
      })
    },

    onAddPreviewClicked(comment) {
      this.modals.addPreview = true
    },

    onAddExtraPreview() {
      this.modals.addExtraPreview = true
    },

    onRemoveExtraPreview(preview) {
      this.currentExtraPreviewId = preview.id
      this.modals.deleteExtraPreview = true
    },

    onCommentAdded() {
      this.taskComments = this.getTaskComments(this.task.id)
    },

    onCancelRemoveExtraPreview() {
      this.modals.deleteExtraPreview = false
    },

    onClosePreview() {
      this.modals.addPreview = false
    },

    onCloseExtraPreview() {
      this.modals.addExtraPreview = false
    },

    onPreviewChanged(index) {
      this.currentPreviewIndex = index
      this.currentPreviewPath = this.getOriginalPath()
      this.currentPreviewDlPath = this.getOriginalDlPath()
    },

    changeCurrentPreview(previewFile) {
      const index = this.taskPreviews.findIndex((p) => p.id === previewFile.id)
      if (index || index === 0) {
        this.currentPreviewIndex = index
        this.currentPreviewPath = this.getOriginalPath()
        this.currentPreviewDlPath = this.getOriginalDlPath()
      }
    },

    setCurrentPreviewAsEntityThumbnail() {
      this.setPreview({
        taskId: this.task.id,
        entityId: this.task.entity.id,
        previewId: this.currentPreview.previews[0].id
      })
    },

    toggleSubscribe() {
      if (this.task && !this.isAssigned) {
        if (this.isSubscribed) {
          this.unsubscribeFromTask(this.task.id)
          this.isSubscribed = false
        } else {
          this.subscribeToTask(this.task.id)
          this.isSubscribed = true
        }
      }
    },

    toggleWidth() {
      this.isWide = !this.isWide
      const panel = this.$refs['side-panel']
      if (this.isWide) {
        panel.parentElement.style['min-width'] = '700px'
      } else {
        panel.parentElement.style['min-width'] = '350px'
      }
    },

    toggleExtraWidth() {
      this.isExtraWide = !this.isExtraWide
      const panel = this.$refs['side-panel']
      if (this.isExtraWide) {
        panel.parentElement.style['min-width'] = '65vw'
      } else {
        panel.parentElement.style['min-width'] = '700px'
      }
    },

    onAckComment(comment) {
      this.ackComment(comment)
    },

    onDuplicateComment(comment) {
      this.$refs['add-comment'].setValue(comment)
    },

    onPinComment(comment) {
      this.pinComment(comment)
    },

    onEditComment(comment) {
      this.commentToEdit = comment
      this.modals.editComment = true
    },

    onDeleteComment(comment) {
      this.commentToEdit = comment
      this.modals.deleteComment = true
    },

    onCancelEditComment(comment) {
      this.modals.editComment = false
    },

    onCancelDeleteComment(comment) {
      this.modals.deleteComment = false
    },

    saveComment(comment, checklist) {
      this.editTaskComment({
        taskId: this.task.id,
        comment,
        checklist
      })
    },

    confirmDeleteTaskComment() {
      this.loading.deleteComment = true
      this.errors.deleteComment = false
      const commentId = this.commentToEdit.id

      this.deleteTaskComment({
        taskId: this.task.id,
        commentId
      })
        .then(() => {
          this.reset()
          this.loading.deleteComment = false
          this.modals.deleteComment = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.deleteComment = false
          this.errors.deleteComment = true
        })
    },

    confirmEditTaskComment(comment) {
      this.loading.editComment = true
      this.errors.editComment = false
      this.editTaskComment({
        taskId: this.task.id,
        comment
      })
        .then(() => {
          this.loading.editComment = false
          this.modals.editComment = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.editComment = false
          this.errors.editComment = true
        })
    },

    getCurrentTaskComments() {
      return this.getTaskComments(this.task.id)
    },

    confirmDeleteTaskPreview() {
      this.loading.deleteExtraPreview = true
      this.errors.deleteExtraPreview = false
      const previewId = this.currentExtraPreviewId
      const comment = this.getCurrentTaskComments().find((comment) => {
        return comment.previews.findIndex((p) => p.id === previewId) >= 0
      })

      this.previewPlayer.displayFirst()
      this.deleteTaskPreview({
        taskId: this.task.id,
        commentId: comment.id,
        previewId
      })
        .then(() => {
          this.loading.deleteExtraPreview = false
          this.modals.deleteExtraPreview = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.deleteExtraPreview = false
          this.errors.deleteExtraPreview = true
        })
    },

    onRemoteAcknowledge(eventData, type) {
      if (this.task) {
        const comment = this.getTaskComment(this.task.id, eventData.comment_id)
        const user = this.personMap.get(eventData.person_id)
        if (comment && user) {
          if (this.user.id === user.id) {
            if (
              (type === 'ack' && !comment.acknowledgements.includes(user.id)) ||
              (type === 'unack' && comment.acknowledgements.includes(user.id))
            ) {
              this.$store.commit('ACK_COMMENT', { comment, user })
            }
          } else {
            this.$store.commit('ACK_COMMENT', { comment, user })
          }
        }
      }
    },

    isStatusChange(index) {
      const comment = this.taskComments[index]
      return (
        index === this.taskComments.length - 1 ||
        comment.task_status_id !== this.taskComments[index + 1].task_status_id
      )
    },

    timeCodeClicked({
      versionRevision,
      minutes,
      seconds,
      milliseconds,
      frame
    }) {
      if (!this.isPreview) {
        this.$emit('time-code-clicked', {
          versionRevision,
          minutes,
          seconds,
          milliseconds,
          frame
        })
        return
      }
      this.changeCurrentPreview(
        this.taskPreviews.find((p) => p.revision === parseInt(versionRevision))
      )
      setTimeout(() => {
        this.previewPlayer.setCurrentFrame(frame - 1)
        this.previewPlayer.focus()
      }, 20)
    },

    onTimeUpdated(time) {
      this.currentTime = time
    },

    async extractAnnotationSnapshots() {
      const files = await this.previewPlayer.extractAnnotationSnapshots()
      this.$refs['add-comment'].setAnnotationSnapshots(files)
      return files
    },

    updateDurationValue() {
      peopleApi.getUserTaskTimeSpent(this.task.id, moment(this.selectedDate).format('YYYY-MM-DD'), (err, timeSpent) => {
        if (!err && timeSpent) {
          this.durationValue = timeSpent.duration ? timeSpent.duration / 60 : 0
        }
        else {
          this.durationValue = 0
        }
      })
    }
  },

  watch: {
    task() {
      this.attachedFileName = ''
      this.currentPreviewIndex = 0
      if (!this.silent) {
        this.loadTaskData()
      }
    },

    selectedDate() {
      this.updateDurationValue()
      this.updatedDurationValue = true
    },

    durationValue() {
      if (!this.updatedDurationValue) {
        peopleApi.setTimeSpent(this.task.id, this.user.id, moment(this.selectedDate).format('YYYY-MM-DD'), this.durationValue)
      }
      else {
        this.updatedDurationValue = false
      }
    }
  },

  socket: {
    events: {
      'preview-file:add-file'(eventData) {
        this.onPreviewAdded(eventData)
      },

      'preview-file:update'(eventData) {
        const comment = this.taskComments.find(
          (c) =>
            c.previews &&
            c.previews.length > 0 &&
            c.previews[0].id === eventData.preview_file_id
        )
        if (comment && this.task) {
          this.refreshPreview({
            taskId: this.task.id,
            previewId: eventData.preview_file_id
          }).then((preview) => {
            comment.previews[0].validation_status = preview.validation_status
          })
        }
      },

      'comment:new'(eventData) {
        setTimeout(() => {
          if (
            this.task &&
            this.getTaskComments(this.task.id).length !==
              this.taskComments.length
          ) {
            this.taskComments = this.getTaskComments(this.task.id)
            this.taskPreviews = this.getTaskPreviews(this.task.id)
          }
        }, 1000)
      },

      'comment:acknowledge'(eventData) {
        this.onRemoteAcknowledge(eventData, 'ack')
      },

      'comment:unacknowledge'(eventData) {
        this.onRemoteAcknowledge(eventData, 'unack')
      },

      'comment:reply'(eventData) {
        if (this.task) {
          const comment = this.taskComments.find(
            (c) => c.id === eventData.comment_id
          )
          if (comment) {
            if (!comment.replies) comment.replies = []
            const reply = comment.replies.find(
              (r) => r.id === eventData.reply_id
            )
            if (!reply) {
              this.refreshComment({
                taskId: this.task.id,
                commentId: eventData.comment_id
              })
                .then((remoteComment) => {
                  comment.replies = remoteComment.replies
                })
                .catch(console.error)
            }
          }
        }
      },

      'comment:delete-reply'(eventData) {
        if (this.task) {
          const comment = this.taskComments.find(
            (c) => c.id === eventData.comment_id
          )
          if (comment) {
            if (!comment.replies) comment.replies = []
            this.$store.commit('REMOVE_REPLY_FROM_COMMENT', {
              comment,
              reply: { id: eventData.reply_id }
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .add-comment,
  .time-spent,
  .comment,
  .preview-column-content,
  .no-comment {
    background: #46494f;
    border-color: $dark-grey;
    box-shadow: 0px 0px 6px #333;
  }

  .no-preview {
    padding: 0.5em;
  }

  .side {
    background: #36393f;
  }

  .task-info {
    color: white;
  }
}

.side {
  background: #f8f8f8;
  min-height: 100%;
}

.add-comment {
  padding: 0.5em;
  margin-bottom: 0.5em;
  box-shadow: 0px 0px 6px #e0e0e0;
}

.time-spent {
  padding: 0.5em;
  margin-bottom: 0.5em;
  box-shadow: 0px 0px 6px #e0e0e0;
  border-radius: 5px;
}

.page-header {
  padding: 0;
  margin-top: 0;
}

.header-title .flexrow-item {
  margin-bottom: 0.5em;
}

.title {
  margin: 0;
  flex: 1;
  font-size: 1.3em;
  line-height: 1.5em;
}

.title a {
  color: inherit;
}

.history-button {
  flex: 1;
}

.no-comment {
  background: white;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0px 0px 6px #e0e0e0;
}

.task-columns {
  display: flex;
  flex-direction: column;
}

.task-column {
  margin-top: 1em;
}

.comment {
  border-top: 1px solid $white-grey;
  border-bottom: 1px solid $white-grey;
  border-right: 1px solid $white-grey;
  margin-top: 0.1em;
  box-shadow: 0px 0px 6px #e0e0e0;
}

.add-preview-button {
  margin-top: 0.5em;
  width: 100%;
}

.no-comment {
  background: white;
  box-shadow: 0px 0px 6px #e0e0e0;
}

.comments {
  padding-bottom: 1em;
}

.preview-colum-content {
  box-shadow: 0px 0px 6px #e0e0e0;
}

.preview-standard-file {
  text-align: center;
  padding: 1em;
}

.model-viewer {
  padding: 0.3em;
}

.change-wideness-button,
.set-thumbnail-button {
  margin-right: 0.2em;
}

.preview {
  position: relative;
}

.preview-list {
  span {
    cursor: pointer;
    padding: 0.2em;
    margin: 0.2em;
    text-align: center;
    border-radius: 3px;

    &:hover {
      background: var(--background-selectable);
    }

    &.selected {
      background: var(--background-selected);
    }
  }
}
.slider-flex {
  width: 100%;
  padding-right: 10px;
}

.slider-infos {
  font-size: 1.5em;
  margin-right: 15px;
  font-weight: bold;
  width: 30px;
}
</style>
