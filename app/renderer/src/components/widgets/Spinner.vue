<template>
  <div class="has-text-centered" :style="sizeStyle">
    <img v-if="isWhite" src="@/assets/spinner-white.svg" />
    <square-grid v-else-if="isProcessing" :style="{ margin: 'auto' }" />
    <origami v-else-if="isStylish" :style="{ margin: 'auto' }" />
    <img v-else src="@/assets/spinner.svg" />
  </div>
</template>

<script>
import Origami from '@/components/spinners/Origami.vue'
import SquareGrid from '@/components/spinners/SquareGrid.vue'

export default {
  name: 'Spinner',
  components: {
    SquareGrid,
    Origami
  },

  props: {
    isWhite: {
      type: Boolean,
      default: false
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    isStylish: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number
    }
  },

  computed: {
    sizeStyle: function () {
      return {
        width: this.size ? this.size + 'px' : 'auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
