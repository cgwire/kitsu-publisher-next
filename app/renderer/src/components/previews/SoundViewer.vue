<template>
  <div
    id="sound-container"
    :style="{
      height: '100%',
      width: '100%'
    }"
  >
    <div
      v-show="isLoading"
      class="loading"
    >
      <spinner />
    </div>
    <div
      v-show="!isLoading"
      class="file-name"
    >
      {{ fileName }}
    </div>
    <div id="waveform" />
  </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import Spinner from '@/components/widgets/Spinner'

export default {
  name: 'SoundViewer',

  components: {
    Spinner
  },

  props: {
    previewUrl: {
      default: '',
      type: String
    },
    fileName: {
      default: '',
      type: String
    },
    defaultHeight: {
      type: Number,
      default: 200
    },
    fullScreen: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return {
      isLoading: false,
      wavesurfer: null
    }
  },

  computed: {
    container() {
      return this.$refs.container
    }
  },

  watch: {
    defaultHeight() {},

    previewUrl() {
      if (this.previewUrl && this.previewUrl.length > 0) {
        this.isLoading = true
        this.wavesurfer.load(this.previewUrl)
      }
    },

    light() {}
  },

  mounted() {
    this.isLoading = true
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#00B242', // green
      progressColor: '#008732', // dark-green,
      height: this.defaultHeight,
      responsive: true
    })
    this.wavesurfer.on('ready', () => {
      this.isLoading = false
    })
    this.wavesurfer.on('finish', () => {
      this.$emit('play-ended')
    })
    if (this.previewUrl) {
      this.isLoading = true
      this.wavesurfer.load(this.previewUrl)
    }
  },

  methods: {
    play() {
      this.wavesurfer.play()
    },

    pause() {
      this.wavesurfer.pause()
    },

    redraw() {}
  }
}
</script>

<style lang="scss" scoped>
#sound-container {
  position: relative;
  display: flex;
}

.file-name {
  position: absolute;
  left: 4px;
  bottom: 4px;
  color: $white;
}

.loading {
  position: absolute;
  left: calc(50% - 10px);
  top: calc(50% - 10px);
  color: white;
}

#waveform {
  flex: 1;
  margin: auto;
}
</style>
