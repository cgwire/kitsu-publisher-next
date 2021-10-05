<template>
  <td>
    <div class="flexrow">
      <span class="value flexrow-item">
        {{ value }}
      </span>
      <vue-slider
        ref="slider"
        v-model="value"
        class="flexrow-item slider"
        :included="true"
        v-bind="options"
      />
      <button class="button flexrow-item" @click="setValue(1)">1</button>
      <button class="button flexrow-item" @click="setValue(4)">4</button>
      <button
        class="button flexrow-item"
        @click="setValue(organisation.hours_by_day || 8)"
      >
        {{ organisation.hours_by_day || 8 }}
      </button>
    </div>
  </td>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: 'TimeSliderCell',

  components: {
    VueSlider
  },

  props: {
    'task-id': {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      value: this.duration,
      options: {
        show: true,
        width: 400,
        min: 0,
        max: 10,
        lazy: true,
        marks: [
          0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5,
          8, 8.5, 9, 9.5, 10
        ],
        hideLabel: true,
        piecewise: true,
        tooltip: 'focus',
        tooltipPlacement: 'bottom',
        processStyle: {
          'background-color': '#8F91EB'
        },
        railStyle: {
          background: '#CCC'
        }
      }
    }
  },

  computed: {
    ...mapGetters(['organisation'])
  },

  methods: {
    ...mapActions([]),

    setValue(value) {
      this.value = value
    }
  },

  watch: {
    value() {
      this.$emit('change', {
        taskId: this.taskId,
        duration: this.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.value {
  font-size: 1.5em;
  font-weight: bold;
  width: 30px;
}

.slider {
  cursor: pointer;
  z-index: 0;
}
</style>
