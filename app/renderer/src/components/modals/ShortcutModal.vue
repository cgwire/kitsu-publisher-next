<template>
  <div
    :class="{
      modal: true,
      'is-active': active
    }"
  >
    <div class="modal-background" @click="$emit('cancel')" />

    <div class="modal-content">
      <div class="box content">
        <h1 class="title">
          {{ $t('keyboard.shortcuts') }}
        </h1>

        <div
          v-for="shortcutGroup in shortcutGroups"
          :key="shortcutGroup.label"
          class="mt2"
        >
          <h3>
            {{ $t(shortcutGroup.label) }}
          </h3>

          <div
            v-for="(shortcut, i) in shortcutGroup.shortcuts"
            :key="`shortcut-${i}`"
            class="shortcut"
          >
            <div class="shortcut-key-wrapper">
              <div
                v-for="(key, j) in shortcut.keys"
                :key="`shortcut-key-${i}-${j}`"
              >
                <span class="shortcut-key">{{ key }}</span>
                <span
                  v-if="j !== shortcut.keys.length - 1"
                  class="shortcut-plus"
                  >+
                </span>
              </div>
            </div>
            <span class="shortcut-text">{{ shortcut.text }}</span>
          </div>
        </div>

        <div class="has-text-right modal-footer">
          <button class="button is-link" @click="$emit('cancel')">
            {{ $t('main.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from '@/components/modals/base_modal'

export default {
  name: 'ShotHistoryModal',

  components: {},
  mixins: [modalMixin],

  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      shortcutGroups: [
        {
          label: 'keyboard.navigation',
          shortcuts: [
            {
              keys: ['Alt', '←'],
              text: this.$t('keyboard.altleft')
            },
            {
              keys: ['Alt', '↑'],
              text: this.$t('keyboard.altup')
            },
            {
              keys: ['Alt', '→'],
              text: this.$t('keyboard.altright')
            },
            {
              keys: ['Alt', '↓'],
              text: this.$t('keyboard.altdown')
            },
            {
              keys: ['Ctrl', '←'],
              text: this.$t('keyboard.ctrlleft')
            },
            {
              keys: ['Ctrl', '↑'],
              text: this.$t('keyboard.ctrlup')
            },
            {
              keys: ['Ctrl', '→'],
              text: this.$t('keyboard.ctrlright')
            },
            {
              keys: ['Ctrl', '↓'],
              text: this.$t('keyboard.ctrldown')
            }
          ]
        },
        {
          label: 'keyboard.playlist_navigation',
          shortcuts: [
            {
              keys: ['Alt', 'j'],
              text: this.$t('keyboard.altj')
            },
            {
              keys: ['Alt', 'k'],
              text: this.$t('keyboard.altk')
            }
          ]
        },
        {
          label: 'keyboard.annotations',
          shortcuts: [
            {
              keys: ['Ctrl', 'z'],
              text: this.$t('keyboard.undo')
            },
            {
              keys: ['Alt', 'r'],
              text: this.$t('keyboard.redo')
            },
            {
              keys: ['Alt', 'd'],
              text: this.$t('keyboard.draw')
            },
            {
              keys: ['Suppr'],
              text: this.$t('keyboard.remove_annotation')
            }
          ]
        }
      ]
    }
  },

  mounted() {
    this.reset()
  },

  computed: {
    ...mapGetters([])
  },

  methods: {
    ...mapActions(['loadShotHistory']),

    reset() {},

    formatDate(dateString) {}
  }
}
</script>

<style lang="scss" scoped>
.dark {
  h3 {
    color: $white;
  }
  .shortcut-key {
    border: 2px solid $white;
  }
}

.shortcut-key-wrapper {
  min-width: 110px;
  display: inline-block;
  padding: 0.8em;

  div {
    display: inline-block;
  }
}

.shortcut-key {
  border-radius: 0.3em;
  border: 2px solid $dark-grey;
  padding: 0.3em;
}

.shortcut-plus {
  padding: 0 0.5em;
  margin: 0;
}
</style>
