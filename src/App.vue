<template>
  <div :class="{ theme: true, dark: isDarkTheme }">
    <div
      class="has-text-centered mt2 loading-info"
      v-if="user && isDataLoading"
    >
        <span>{{ $t('main.loading_data') }}...</span>
      <spinner class="mt2" />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Spinner from './components/widgets/Spinner.vue'
import crisp from './lib/crisp'
export default {
  name: 'app',
  components: {
    Spinner
  },
  computed: {
    ...mapGetters([
      'assetMap',
      'assetTypeMap',
      'currentEpisode',
      'currentProduction',
      'episodeMap',
      'isCurrentUserAdmin',
      'isDataLoading',
      'isDarkTheme',
      'isLoginLoading',
      'isSavingCommentPreview',
      'isTVShow',
      'route',
      'personMap',
      'productionMap',
      'sequenceMap',
      'shotMap',
      'taskMap',
      'taskStatusMap',
      'taskTypeMap',
      'user'
    ])
  },
  mounted () {
    if (localStorage.getItem('dark-theme') === 'true' && !this.isDarkTheme) {
      this.$store.commit('TOGGLE_DARK_THEME')
      document.documentElement.style.background = '#36393F'
      document.body.style.background = '#36393F'
    } else {
      document.documentElement.style.background = '#FFF'
      document.body.style.background = '#FFF'
    }
    crisp.init()
  },
  metaInfo: {
    link: [
      {
        rel: 'icon',
        href: '/static/favicon.ico'
      }
    ]
  },
  methods: {
    ...mapActions([
      'getOrganisation',
      'loadTask',
      'loadAsset',
      'loadAssetType',
      'loadComment',
      'loadEpisode',
      'loadOpenProductions',
      'loadPerson',
      'loadPersonTasks',
      'loadProduction',
      'loadSequence',
      'loadShot',
      'loadTaskStatus',
      'loadTaskType',
      'refreshMetadataDescriptor',
      'removeAsset'
    ]),
    onAssignation (eventData, assign = true) {
      const personId = eventData.person_id
      const selectedTaskIds = [eventData.task_id]
      // for entity lists
      if (assign) {
        this.$store.commit('ASSIGN_TASKS', { selectedTaskIds, personId })
      } else {
        this.$store.commit('UNASSIGN_TASKS', selectedTaskIds)
      }
      // for todo lists
      if (this.route.path.indexOf(eventData.person_id) > 0) {
        this.loadPersonTasks({
          personId: eventData.person_id,
          forced: true
        })
      }
    }
  },
  watch: {
    isDarkTheme () {
      if (this.isDarkTheme) {
        document.documentElement.style.background = '#36393F'
        document.body.style.background = '#36393F'
      } else {
        document.documentElement.style.background = '#FFF'
        document.body.style.background = '#FFF'
      }
    }
  },
}
</script>

<style lang="scss">
@font-face {
  font-family: Lato;
  font-style: normal;
  font-weight: 400;
  src: url(assets/Lato.woff2) format("woff2");
}

html {
  height: 100%;
  overflow-y: auto;
  font-family: Lato, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  height: 100%;
  min-height: 100%;
  width: 100%;
  background: #eee;
  overflow: auto;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
}

.dark {
}
</style>
