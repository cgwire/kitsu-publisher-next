<template>
  <td
    ref="cell"
    :class="{
      validation: selectable,
      selected: selectable & selected
    }"
    :style="{
      'border-left': isBorder ? '1px solid ' + column.color : 'none',
      background: isBorder ? getBackground() : 'transparent',
      left: left
    }"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut"
    @click="onClick"
  >
    <div
      v-if="!minimized"
      class="wrapper"
    >
      <span v-if="task">
        <span
          class="tag"
          :title="taskStatus.name"
          :style="{
            background: backgroundColor,
            color: color
          }"
        >
          {{ taskStatus.short_name }}
        </span>
        <span
          v-if="!isCurrentUserClient"
          class="priority"
        >
          {{ priority }}
        </span>
        <span
          v-if="!isCurrentUserClient && isCastingReady"
          class="casting-status"
          :title="castingTitle"
        >
          <img
            src="@/assets/icons/casting-ready.png"
            width="20"
          >
        </span>
        <span
          v-else-if="!isCurrentUserClient"
          class="casting-status"
          :title="castingTitle"
        >
          &nbsp; &nbsp; &nbsp; &nbsp;
        </span>
      </span>
      <span />
      <span
        v-for="personId in assignees"
        v-if="isAssignees && !isCurrentUserClient"
        :key="'avatar-' + personId"
        class="avatar has-text-centered"
        :title="personMap.get(personId).full_name"
        :style="{
          background: personMap.get(personId).color,
          width: '20px',
          height: '20px',
          'font-size': '10px'
        }"
      >
        <img
          v-if="personMap.get(personId).has_avatar"
          :key="avatarKey(personId)"
          v-lazy="avatarPath(personId)"
          width="20"
          height="20"
        >
        <span v-else>
          {{ personMap.get(personId).initials }}
        </span>
      </span>
    </div>
    <div
      v-else
      class="wrapper"
    >
      <span
        class="tag"
        :style="{
          background: backgroundColor,
          color: color
        }"
      >
        &nbsp;
      </span>
    </div>
  </td>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import colors from '@/lib/colors'

export default {
  name: 'ValidationCell',

  components: {},

  props: {
    column: {
      default: null,
      type: Object
    },
    entity: {
      default: null,
      type: Object
    },
    taskTest: {
      default: null,
      type: Object
    },
    isCastingReady: {
      default: false,
      type: Boolean
    },
    castingTitle: {
      default: '',
      type: String
    },
    isBorder: {
      default: true,
      type: Boolean
    },
    isStatic: {
      default: false,
      type: Boolean
    },
    isAssignees: {
      default: true,
      type: Boolean
    },
    minimized: {
      default: false,
      type: Boolean
    },
    selectable: {
      default: true,
      type: Boolean
    },
    clickable: {
      default: true,
      type: Boolean
    },
    selected: {
      default: false,
      type: Boolean
    },
    rowX: {
      default: 0,
      type: Number
    },
    columnY: {
      default: 0,
      type: Number
    },
    left: {
      type: String,
      default: '0px'
    },
    sticked: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return {
      task: null
    }
  },

  mounted() {
    if (this.taskTest) {
      this.task = this.taskTest
    } else if (this.entity && this.column) {
      this.task = this.taskMap.get(this.entity.validations.get(this.column.id))
    }
    this.changeStyleBasedOnSelected()
  },

  computed: {
    ...mapGetters([
      'isDarkTheme',
      'isCurrentUserClient',
      'personMap',
      'taskMap',
      'taskStatusMap'
    ]),

    assignees() {
      if (this.task) {
        return this.task.assignees
      } else {
        return []
      }
    },

    backgroundColor() {
      if (this.taskStatus.short_name === 'todo' && !this.isDarkTheme) {
        return '#ECECEC'
      } else if (this.taskStatus.short_name === 'todo' && this.isDarkTheme) {
        return '#5F626A'
      } else if (this.isDarkTheme) {
        return colors.darkenColor(this.taskStatus.color)
      } else {
        return this.taskStatus.color
      }
    },

    color() {
      if (this.taskStatus.short_name !== 'todo' || this.isDarkTheme) {
        return 'white'
      } else {
        return '#333'
      }
    },

    priority() {
      if (this.task.priority && !this.taskStatus.is_done) {
        if (this.task.priority === 3) {
          return '!!!'
        } else if (this.task.priority === 2) {
          return '!!'
        } else if (this.task.priority === 1) {
          return '!'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },

    taskStatus() {
      if (this.task) {
        const taskStatusId = this.task.task_status_id
        return this.taskStatusMap ? this.taskStatusMap.get(taskStatusId) : {}
      } else {
        return {}
      }
    }
  },

  methods: {
    ...mapActions([]),

    getBackground() {
      if (this.isBorder && !this.sticked) {
        const opacity = this.isDarkTheme ? 0.15 : 0.08
        return colors.hexToRGBa(this.column.color, opacity)
      } else {
        return 'inherit'
      }
    },

    onMouseOver(event) {
      if (this.selectable && !this.selected) {
        const background = this.isDarkTheme ? '#6E70CA' : '#CFD1FF'
        this.changeStyle(background)
      }
    },

    onMouseOut(event) {
      if (this.selectable && !this.selected) {
        const background = this.getBackground()
        this.changeStyle(background)
      }
    },

    onClick(event) {
      if (this.clickable) {
        this.select(event)
      }
    },

    changeStyle(background) {
      const border = this.isBorder ? '1px solid ' + this.column.color : 'none'
      this.$refs.cell.style = `border-left: ${border}; background: ${background}; left: ${this.left}`
    },

    select(event) {
      const isUserClick = event.isUserClick !== false
      if (this.selectable) {
        if (
          this.$refs.cell &&
          this.$refs.cell.className.indexOf('selected') < 0
        ) {
          this.$emit('select', {
            entity: this.entity,
            column: this.column,
            task: this.task,
            x: this.rowX,
            y: this.columnY,
            isCtrlKey: event.ctrlKey || event.metaKey,
            isShiftKey: event.shiftKey,
            isUserClick: isUserClick
          })
        } else {
          this.$emit('unselect', {
            entity: this.entity,
            column: this.column,
            task: this.task,
            x: this.rowX,
            y: this.columnY,
            isCtrlKey: event.ctrlKey || event.metaKey,
            isShiftKey: event.shiftKey,
            isUserClick: isUserClick
          })
        }
      }
    },

    avatarPath(personId) {
      const person = this.personMap.get(personId)
      if (person) {
        return person.avatarPath + '?unique=' + person.uniqueHash
      } else {
        return ''
      }
    },

    avatarKey(personId) {
      const person = this.personMap.get(personId)
      if (person) {
        return person.id + '-' + person.uniqueHash
      } else {
        return ''
      }
    },

    changeStyleBasedOnSelected() {
      if (this.selected) {
        const background = this.isDarkTheme ? '#5E60BA' : '#BFC1FF'
        this.changeStyle(background)
      } else {
        const background = this.getBackground(
          this.column ? this.column.color : 'transparent'
        )
        this.changeStyle(background)
      }
    }
  },

  watch: {
    selected() {
      this.changeStyleBasedOnSelected()
    },

    taskTest() {
      if (this.taskTest) {
        this.task = this.taskTest
      } else if (this.entity) {
        this.task = this.taskMap.get(
          this.entity.validations.get(this.column.id)
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dark td.selected,
.dark td.selected.validation:hover {
  background-color: #8f91eb;
}

.validation {
  cursor: pointer;
  margin-bottom: 3px;
}

.wrapper {
  position: relative;
  display: flex;
  flex-wrap: wrap;
}

span.person-avatar:nth-child(2) {
  margin-left: 3px;
}

.validation-tag {
  margin-bottom: 3px;
}

.person-avatar {
  margin-right: 3px;
}

.avatar {
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
}

.avatar span {
  flex: 1;
}

.avatar img {
  width: 20px;
  height: 20px;
}

.tag {
  text-transform: uppercase;
  margin-right: 0.1em;
  margin-bottom: 0.3em;
}

.priority {
  color: red;
  margin-right: 3px;
}

.casting-status {
  position: absolute;
  right: -5px;
  top: -8px;

  img {
    width: 12px;
  }
}
</style>
