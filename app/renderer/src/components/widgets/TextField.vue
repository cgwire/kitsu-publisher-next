<template>
  <div
    class="field"
    :class="{ 'is-inline': isInline }"
  >
    <label
      v-if="label"
      class="label"
    >{{ label }}</label>
    <label
      v-if="emptyLabel"
      class="label empty-label"
    >A</label>
    <p
      class="control"
      :class="{
        'is-inline': isInline,
        flexrow: !isInline
      }"
    >
      <input
        ref="input"
        :class="'input flexrow-item' + inputClass"
        :placeholder="placeholder"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :maxlength="maxlength"
        min="0"
        @input="updateValue()"
        @keyup.enter="emitEnter()"
      >
      <button
        v-if="buttonLabel"
        class="button flexrow-item"
        @click="emitEnter()"
      >
        {{ buttonLabel }}
      </button>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TextField',
  props: {
    disabled: {
      default: false,
      type: Boolean
    },
    label: {
      default: '',
      type: String
    },
    modelValue: {
      default: '',
      type: [String, Number]
    },
    placeholder: {
      default: '',
      type: String
    },
    type: {
      default: 'text',
      type: String
    },
    inputClass: {
      default: '',
      type: String
    },
    buttonLabel: {
      default: '',
      type: String
    },
    maxlength: {
      default: 524288,
      type: Number
    },
    isInline: {
      default: false,
      type: Boolean
    },
    emptyLabel: {
      default: false,
      type: Boolean
    }
  },

  computed: {
    ...mapGetters([])
  },

  methods: {
    ...mapActions([]),

    emitEnter() {
      this.$emit('enter', this.$refs.input.value)
    },

    updateValue() {
      this.$emit('update:modelValue', this.$refs.input.value)
    },

    focus() {
      this.$refs.input.focus()
    }
  }
}
</script>
<style lang="scss" scoped>
.input.is-size-2 {
  width: 3rem;
}

.input.is-size-3 {
  width: 3.5rem;
}

.input.is-size-4 {
  width: 5rem;
}

.input.is-small {
  height: 2rem;
  font-size: 1rem;
  padding: 0 0.5rem;
}

input.input {
  font-size: 1.2em;
}
input.input.thin {
  height: 2.4em;
}

.flexrow-item {
  margin: 0;
}

button {
  font-size: 1.2em;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}

.empty-label {
  opacity: 0;
}
</style>
