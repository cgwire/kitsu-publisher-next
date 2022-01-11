<template>
  <div v-if="!isSimple" class="field">
    <label v-if="label.length > 0" class="label">
      {{ label }}
    </label>
    <p class="control">
      <span
        :class="{
          select: true
        }"
      >
        <select
          ref="select"
          class="select-input"
          :disabled="disabled"
          @keyup.enter="emitEnter()"
          @change="updateValue"
        >
          <option
            v-for="(option, i) in options"
            :key="i + '-' + option.label + '-' + option.value"
            :value="
              option.value !== null && option.value !== undefined
                ? option.value
                : option.label
            "
            :selected="value === option.value"
          >
            {{ getOptionLabel(option) }}
          </option>
        </select>
      </span>
    </p>
  </div>
  <span v-else class="select">
    <select
      ref="select"
      class="select-input"
      @keyup.enter="emitEnter()"
      @change="updateValue"
    >
      <option
        v-for="(option, i) in options"
        :key="i + '-' + option.label + '-' + option.value"
        :value="option.value || option.label"
        :selected="value === option.value"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </span>
</template>

<script>
export default {
  name: 'Combobox',

  props: {
    label: {
      default: '',
      type: String
    },
    value: {
      default: 0,
      type: Number
    },
    options: {
      default: () => [],
      type: Array
    },
    localeKeyPrefix: {
      default: '',
      type: String
    },
    isSimple: {
      default: false,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },

  computed: {},

  methods: {
    updateValue() {
      this.$emit('update:modelValue', parseInt(this.$refs.select.value))
    },
    emitEnter() {
      this.$emit('enter', parseInt(this.$refs.select.value))
    },

    getOptionLabel(option) {
      if (this.localeKeyPrefix.length > 0) {
        return this.$t(this.localeKeyPrefix + option.label.toLowerCase())
      } else {
        return option.label
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dark select:disabled {
  background: $dark-grey;
  border-color: $dark-grey-strong;
}

.select-input {
  height: 3em;
}

.select::after {
  border: 1px solid $green;
  border-right: 0;
  border-top: 0;
  margin-top: -2px;
}

.select.is-top::after {
  border: 2px solid $green;
  border-right: 0;
  border-top: 0;
  margin-top: -4px;
}
</style>
