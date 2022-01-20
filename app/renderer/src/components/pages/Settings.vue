<template>
  <div class="settings page">
    <div class="settings-content">
      <div class="has-text-centered settings-header">
        <div class="settings-header-content has-text-centered">
          <h1 class="main-title">
            {{ $t('publishersettings.title') }}
          </h1>
        </div>
      </div>

      <div class="settings-body">
        <text-field
          v-model="form.DCCsExportsDirectory"
          :label="$t('publishersettings.dccs_exports_directory')"
        />
        <text-field
          v-model="form.PostExportsCommand"
          :label="$t('publishersettings.post_exports_command')"
        />
        <button
          :class="{
            button: true,
            'save-button': true,
            'is-medium': true,
            'is-disabled': isSettingsFormHaveChanged,
            'is-loading': isSaveSettingsLoading
          }"
          @click="saveSettings(form)"
        >
          {{ $t('publishersettings.save.button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import TextField from '@/components/widgets/TextField'

export default {
  name: 'Settings',

  components: {
    TextField
  },

  data() {
    return {
      form: {
        DCCsExportsDirectory: '',
        PostExportsCommand: ''
      }
    }
  },

  computed: {
    ...mapGetters([
      'DCCsExportsDirectory',
      'PostExportsCommand',
      'isSaveSettingsLoading'
    ]),

    isSettingsFormHaveChanged() {
      return (
        this.form.DCCsExportsDirectory === this.DCCsExportsDirectory &&
        this.form.PostExportsCommand === this.PostExportsCommand
      )
    }
  },

  watch: {
    DCCsExportsDirectory() {
      this.form.DCCsExportsDirectory = this.DCCsExportsDirectory
    },
    PostExportsCommand() {
      this.form.PostExportsCommand = this.PostExportsCommand
    }
  },

  mounted() {
    this.form.DCCsExportsDirectory = this.DCCsExportsDirectory
    this.form.PostExportsCommand = this.PostExportsCommand
  },

  methods: {
    ...mapActions([
      'changeDCCsExportsDirectory',
      'changePostExportsCommand',
      'saveSettings'
    ])
  },

  metaInfo() {
    return {
      title: `${this.$t('settings.title')} - Kitsu`
    }
  }
}
</script>

<style lang="scss" scoped>
.dark .settings {
  background: #36393f;
  color: $white-grey;
}

.dark .settings-content {
  background: $dark-grey-lighter;
  color: $white-grey;
}

.settings {
  background: $white-grey;
  width: 100%;
  flex: 1 1 auto;
  height: 100%;
}

.settings-content {
  background: white;
  max-width: 500px;
  margin: auto;
  margin-top: 6em;
  margin-bottom: 2em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 4px 2px;
}

.settings-body {
  padding: 2em;
}

input,
select,
span.select {
  width: 100%;
}

.field {
  margin-bottom: 2em;
}

.settings-header {
  background: $light-green;
  padding: 2em;
  max-height: 170px;
}

.settings-content,
.settings-header {
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
}

.settings-content {
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
}

.settings-header-content {
  position: relative;
}

.settings-header h1 {
  font-size: 2em;
  margin-top: 0.5em;
}

.settings-header,
.settings-header a {
  color: white;
}

.settings-header .column {
}

h2 {
  border-bottom: 1px solid #ddd;
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
}

h2:first-child {
  margin-top: 0em;
}

.big-number {
  font-size: 3em;
}

.select:after {
  border-color: $light-green;
}

.save-button {
  border-radius: 2em;
  width: 100%;
  background: $green;
  border-color: $green;
  color: white;
}

.save-button:hover {
  background: $light-green;
  border-color: $light-green;
}

select {
  height: 3em;
}
</style>