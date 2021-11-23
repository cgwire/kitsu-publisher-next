<template>
  <div :class="{ field: withMargin }">
    <label v-if="label" class="label">{{ label }}</label>
    <p class="control flexrow">
      <datepicker
        v-model="localValue"
        :lower-limit="disabledDates.to"
        :upper-limit="disabledDates.from"
      />
      <span
        v-show="localValue && canDelete"
        class="clear-button unselectable"
        @click="(event) => clearValue(event)"
      >
        +
      </span>
    </p>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapGetters, mapActions } from 'vuex'
import Datepicker from 'vue3-datepicker'

import { domMixin } from '@/components/mixins/dom'
import { formatSimpleDate } from '@/lib/time'

export default {
  name: 'DateField',

  components: {
    Datepicker
  },

  mixins: [domMixin],

  props: {
    disabledDates: {
      default: () => {},
      type: Object
    },
    label: {
      default: '',
      type: String
    },
    shortDate: {
      default: true,
      type: Boolean
    },
    modelValue: {
      default: new Date(),
      type: Date
    },
    canDelete: {
      default: true,
      type: Boolean
    },
    withMargin: {
      default: true,
      type: Boolean
    }
  },

  data() {
    return {
      localValue: null,
      attributes: {
        popover: {
          visibility: 'visible'
        }
      }
    }
  },

  computed: {
    ...mapGetters(['user']),

    renderedDate(date) {
      return formatSimpleDate(date)
    },

    locale() {
      return this.user.locale.substring(0, 2)
    }
  },

  watch: {
    modelValue() {
      this.localValue = this.modelValue
    },

    localValue() {
      this.$emit('update:modelValue', this.localValue)
    }
  },

  mounted() {
    this.localValue = this.modelValue
  },

  methods: {
    ...mapActions([]),

    clearValue(event) {
      this.pauseEvent(event)
      this.localValue = null
      this.$emit('update:modelValue', null)
    },

    onDayClicked(day) {
      this.$emit('update:modelValue', moment(day.date))
    }
  }
}
</script>
<style lang="scss" scoped>
.control {
  position: relative;
}

.clear-button {
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 0px;
  color: $light-grey;
  transform: rotate(45deg);
}
</style>
