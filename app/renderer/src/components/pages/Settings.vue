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
        <div class="flexrow">
          <text-field
            v-model="form.DCCsExportsDirectory"
            class="textfieldwithbtn"
            :label="$t('publishersettings.dccs_exports_directory')"
          />
          <button
            class="button is-link btnwithtextfield"
            @click="openExplorerExportsDirectory()"
          >
            <span class="icon">
              <icon name="folder" :width="20" />
            </span>
          </button>
        </div>
        <div class="flexrow">
          <text-field
            v-model="form.PostExportsCommand"
            class="textfieldwithbtn"
            :label="$t('publishersettings.post_exports_command.description')"
          />
          <popper
            hover
            offsetDistance="auto"
            placement="top"
            offsetSkid="-250"
            class="btnwithtextfield"
          >
            <button class="button is-link">
              <span class="icon">
                <icon name="info" :width="20" />
              </span>
            </button>
            <template #content>
              <span class="icon">
                <icon name="info" :width="20" />
              </span>
              <p>
                {{
                  $t('publishersettings.post_exports_command.info', {
                    exportFile: '{exportFile}'
                  })
                }}
              </p>
              <ul>
                <li>
                  {{
                    $t(
                      'publishersettings.post_exports_command.exportsDirectory'
                    )
                  }}
                </li>
                <li>
                  {{ $t('publishersettings.post_exports_command.exportFile') }}
                </li>
                <li>
                  {{
                    $t(
                      'publishersettings.post_exports_command.exportIsAnimation'
                    )
                  }}
                </li>
                <li>
                  {{
                    $t(
                      'publishersettings.post_exports_command.exportIsScreenshot'
                    )
                  }}
                </li>
                <li>
                  {{ $t('publishersettings.post_exports_command.DCCName') }}
                </li>
                <li>
                  {{ $t('publishersettings.post_exports_command.DCCVersion') }}
                </li>
                <li>
                  {{
                    $t('publishersettings.post_exports_command.currentProject')
                  }}
                </li>
                <li>
                  {{
                    $t('publishersettings.post_exports_command.cameraSelected')
                  }}
                </li>
                <li>
                  {{
                    $t(
                      'publishersettings.post_exports_command.rendererSelected'
                    )
                  }}
                </li>
                <li>
                  {{
                    $t(
                      'publishersettings.post_exports_command.extensionSelected'
                    )
                  }}
                </li>
                <li>
                  {{ $t('publishersettings.post_exports_command.entityName') }}
                </li>
                <li>
                  {{
                    $t('publishersettings.post_exports_command.entityTypeName')
                  }}
                </li>
                <li>
                  {{ $t('publishersettings.post_exports_command.episodeName') }}
                </li>
                <li>
                  {{
                    $t('publishersettings.post_exports_command.fullEntityName')
                  }}
                </li>
                <li>
                  {{ $t('publishersettings.post_exports_command.projectName') }}
                </li>
                <li>
                  {{
                    $t('publishersettings.post_exports_command.taskStatusName')
                  }}
                </li>
                <li>
                  {{
                    $t('publishersettings.post_exports_command.taskTypeName')
                  }}
                </li>
              </ul>
            </template>
          </popper>
        </div>
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
import Icon from '@/components/widgets/Icon'
import Popper from 'vue3-popper'

export default {
  name: 'Settings',

  components: {
    TextField,
    Icon,
    Popper
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
    ]),

    openExplorerExportsDirectory() {
      window.electron
        .openDialog({
          title: this.$t('publishersettings.choose_dccs_exports_directory'),
          defaultPath: this.form.DCCsExportsDirectory,
          properties: ['openDirectory', 'createDirectory']
        })
        .then((path, _) => {
          if (path !== undefined) {
            this.form.DCCsExportsDirectory = path[0]
          }
        })
    }
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
  --popper-theme-background-color: #36393f;
  --popper-theme-background-color-hover: #36393f;
  --popper-theme-text-color: #fefefe;
  --popper-theme-border-width: 1px;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 20px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
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
  --popper-theme-background-color: #eee;
  --popper-theme-background-color-hover: #eee;
  --popper-theme-text-color: #202225;
  --popper-theme-border-width: 1px;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 20px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.textfieldwithbtn {
  flex: 0 0 90%;
}

.btnwithtextfield {
  margin: auto;
}

.settings-content {
  background: white;
  max-width: 700px;
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
