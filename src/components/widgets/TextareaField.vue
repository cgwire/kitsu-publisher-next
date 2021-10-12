<template>
  <div class="field">
    <label v-if="label" class="label">{{ label }}</label>
    <p class="control">
      <textarea
        ref="input"
        class="input"
        :class="'input ' + inputClass"
        :placeholder="placeholder"
        :type="type"
        :value="modelValue"
        @input="updateValue"
        @keyup.enter="emitEnter"
        @keyup="emitKeyup"
      />
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TextareaField',
  props: {
    label: {
      default: '',
      type: String
    },
    modelValue: {
      default: '',
      type: String
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
    emitKeyup(event) {
      this.$emit('keyup', event)
    },
    focus() {
      if (this.$refs.input) this.$refs.input.focus()
    }
  }
}
</script>
<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
}

.control {
  flex: 1;
}

textarea {
  height: 100%;
  min-height: 8em;
  max-height: 100%;
  padding: 0.5em;
}
</style>
