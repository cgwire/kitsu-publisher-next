<template>
  <div
    ref="wrapper"
    class="flexrow search-field-wrapper"
    @click="focus"
  >
    <div class="flexrow-item">
      <icon
        name="search"
        class="search-icon"
      />
    </div>

    <div class="flexrow-item search-field">
      <input
        ref="input"
        v-focus
        class="search-input"
        type="text"
        :placeholder="placeholder"
        @input="onSearchChange"
        @keyup.enter="onEnterPressed"
        @focus="setFocusedStyle"
        @blur="unsetFocusedStyle"
      >
    </div>

    <div class="flexrow-item erase-search">
      <span
        class="tag"
        @click="clearSearch"
      > x </span>
    </div>

    <div
      v-if="canSave"
      class="flexrow-item save-search"
    >
      <button
        class="button save-button"
        @click="onSaveClicked"
      >
        <icon
          name="save"
          class="icon is-small only-icon"
        />
      </button>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'SearchField',

  data() {
    return {}
  },

  props: {
    placeholder: {
      type: String,
      default: ''
    },
    canSave: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Icon
  },

  computed: {},

  methods: {
    onSearchChange() {
      this.$emit('change', this.$refs.input.value)
    },

    onEnterPressed() {
      this.$emit('enter', this.$refs.input.value)
    },

    onSaveClicked() {
      const value = this.$refs.input.value.trim()
      if (value.length > 0) {
        if (this.canSave) this.$emit('save', value)
      }
    },

    getValue(value) {
      if (this.$refs.input) {
        return this.$refs.input.value
      } else {
        return ''
      }
    },

    setValue(value) {
      this.$refs.input.value = value
    },

    focus() {
      if (this.$refs.input) {
        this.$refs.input.focus()
      }
    },

    clearSearch() {
      this.setValue('')
      this.onSearchChange()
    },

    setFocusedStyle() {
      this.$refs.wrapper.className = 'flexrow search-field-wrapper focused'
    },

    unsetFocusedStyle() {
      this.$refs.wrapper.className = 'flexrow search-field-wrapper'
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .button.save-button:hover {
    color: $white-grey;
  }

  .search-field-wrapper {
    border: 1px solid #666;

    &.focused {
      box-shadow: 0 0 4px 3px #222;
    }
  }

  .search-input::placeholder {
    color: $grey;
  }
}

.erase-search {
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.search-field {
  margin-right: 0.2em;
}

.search-input {
  width: 300px;
  background: inherit;
  color: var(--text);
}

.search-icon {
  color: var(--text);
}

.search-input::placeholder {
  color: $light-grey;
}

.save-search {
  margin-right: 0;
}

.save-search .button {
  margin-left: 0.5em;
  border: 0;
  color: $grey-strong;
  padding-right: 0;
}

.save-search .button:hover {
  color: $dark-grey-light;
}

.button.save-button {
  background: transparent;
}

.search-field-wrapper {
  border: 1px solid #ddd;
  border-radius: 2em;
  padding: 0.2em 1em;
  margin-right: 1em;
  transition: border 0.5s ease-in-out, box-shadow 0.5s ease-in-out;

  &.focused {
    border: 1px solid $green;
    box-shadow: 0 0 4px 3px #eee;
  }
}

.search-field-wrapper:focus,
.search-field-wrapper:hover {
  border-color: $green;
}

.search-icon {
  width: 20px;
  margin-top: 5px;
}

@media screen and (max-width: 768px) {
  .search-input {
    width: 200px;
  }
}
</style>
