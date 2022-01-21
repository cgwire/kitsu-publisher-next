<template>
  <td>
    <div class="flexrow">
      <span class="value flexrow-item">
        {{ value }}
      </span>
      <slider
        v-model="value"
        v-bind="sliderConfiguration"
        class="flexrow-item slider slider-green"
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
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

export default {
  name: 'TimeSliderCell',

  components: {
    Slider
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
  width: 400px;
  --slider-connect-bg: #00b242;
  --slider-tooltip-bg: #00b242;
}

.dark .slider-green {
  --slider-connect-bg: #008732;
  --slider-tooltip-bg: #008732;
}
</style>
