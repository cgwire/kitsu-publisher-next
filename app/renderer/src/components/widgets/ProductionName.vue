<template>
  <div class="production-name flexrow">
    <div
      v-if="withAvatar"
      class="flexrow-item avatar has-text-centered"
      :style="{
        background: getAvatarColor(production),
        width: size + 'px',
        height: size + 'px',
        'font-size': size - 15 + 'px',
        'line-height': size + 'px'
      }"
    >
      <span v-if="!production.has_avatar">
        {{ generateAvatar(production) }}
      </span>
      <img
        v-else
        :src="getThumbnailPath(production)"
        :style="{
          width: size + 'px',
          height: size + 'px'
        }"
      />
    </div>
    <span v-if="!onlyAvatar" class="flexrow-item avatar-name">
      {{ production.name }}
    </span>
  </div>
</template>

<script>
import colors from '@/lib/colors.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductionName',

  props: {
    production: {
      default: () => {},
      type: Object
    },
    size: {
      default: 40,
      type: Number
    },
    onlyAvatar: {
      default: false,
      type: Boolean
    },
    withAvatar: {
      default: true,
      type: Boolean
    },
    lastProductionScreen: {
      default: 'assets',
      type: String
    }
  },

  computed: {
    ...mapGetters([]),

    productionInfo() {
      const fps = this.production.fps
      const ratio = this.production.ratio
      const resolution = this.production.resolution
      if (fps || ratio || resolution) {
        return `fps: ${fps}\nratio: ${ratio}\nresolution: ${resolution}`
      } else {
        return ''
      }
    }
  },

  methods: {
    ...mapActions([]),

    generateAvatar(production) {
      const firstLetter = production.name.length > 0 ? production.name[0] : 'P'
      return firstLetter.toUpperCase()
    },

    getAvatarColor(production) {
      return colors.fromString(production.name)
    },

    getThumbnailPath(production) {
      return `/api/pictures/thumbnails/projects/${production.id}.png`
    }
  }
}
</script>

<style lang="scss" scoped>
.flexrow-item {
  margin: 0;
}

.avatar-name {
  margin-left: 0.8em;
}
</style>
