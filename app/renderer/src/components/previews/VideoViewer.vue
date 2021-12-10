<template>
  <div ref="container" class="video-player">
    <div ref="video-wrapper" class="video-wrapper">
      <div v-if="isLoading" class="loading-background">
        <spinner class="spinner" />
      </div>
      <video
        id="annotation-movie"
        ref="movie"
        class="annotation-movie"
        preload="auto"
        :style="{
          display: isLoading ? 'none' : 'block'
        }"
        :src="moviePath"
        :poster="posterPath"
        type="video/mp4"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { formatFrame, formatTime, roundToFrame } from '../../lib/video'
import Spinner from '../widgets/Spinner'

import { domMixin } from '@/components/mixins/dom'

export default {
  name: 'VideoViewer',

  components: {
    Spinner
  },
  mixins: [domMixin],

  props: {
    name: {
      type: String,
      default: ''
    },
    big: {
      type: Boolean,
      default: false
    },
    isComparing: {
      type: Boolean,
      default: false
    },
    isHd: {
      type: Boolean,
      default: false
    },
    isDrawing: {
      type: Boolean,
      default: false
    },
    isTyping: {
      type: Boolean,
      default: false
    },
    isMuted: {
      type: Boolean,
      default: false
    },
    isRepeating: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Object,
      default: () => {}
    },
    defaultHeight: {
      type: Number,
      default: 0
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      annotations: [],
      currentTimeRaw: 0,
      isLoading: false,
      maxDuration: '00:00.000',
      videoDuration: 0
    }
  },

  computed: {
    ...mapGetters(['currentProduction']),

    currentFrame() {
      return formatFrame(this.currentTimeRaw, this.fps)
    },

    container() {
      return this.$refs.container
    },

    fps() {
      return this.currentProduction.fps || 24
    },

    status() {
      return this.preview && this.preview.status ? this.preview.status : 'ready'
    },

    isAvailable() {
      return !['broken', 'processing'].includes(this.status)
    },

    isVideo() {
      return this.$refs.movie && this.videoDuration && this.videoDuration > 0
    },

    moviePath() {
      if (this.extension === 'mp4' && this.isAvailable && !this.isHd) {
        return `${this.$store.state.login.server}/api/movies/low/preview-files/${this.preview.id}.mp4`
      } else if (this.extension === 'mp4' && this.isAvailable) {
        return `${this.$store.state.login.server}/api/movies/originals/preview-files/${this.preview.id}.mp4`
      } else {
        return null
      }
    },

    movieDlPath() {
      if (this.preview && this.isAvailable) {
        return `${this.$store.state.login.server}/api/movies/originals/preview-files/${this.preview.id}/download`
      } else {
        return ''
      }
    },

    posterPath() {
      if (this.extension === 'mp4' && this.isAvailable) {
        return `${this.$store.state.login.server}/api/pictures/previews/preview-files/${this.preview.id}.png`
      } else {
        return null
      }
    },

    video() {
      return this.$refs.movie
    },

    videoWrapper() {
      return this.$refs['video-wrapper']
    },

    extension() {
      return this.preview ? this.preview.extension : ''
    },

    isMovie() {
      return this.extension === 'mp4'
    },

    frameFactor() {
      return Math.round((1 / this.fps) * 10000) / 10000
    }
  },

  watch: {
    preview() {
      this.maxDuration = '00:00.000'
      this.pause()
    },

    light() {
      this.onWindowResize()
    },

    isComparing() {
      this.mountVideo()
    },

    isMuted() {
      this.video.muted = this.isMuted
    }
  },

  created() {
    this.running = false
    this.currentTimeCalls = []
  },

  mounted() {
    if (!this.container) return
    this.container.style.height = this.defaultHeight + 'px'
    this.isLoading = true
    if (this.isMuted) {
      this.video.muted = this.isMuted
    }
    setTimeout(() => {
      if (this.video) {
        this.video.addEventListener(
          'focus',
          function () {
            this.blur()
          },
          false
        )
        this.video.addEventListener('loadedmetadata', () => {
          this.configureVideo()
          this.onWindowResize()
          this.video.removeEventListener('timeupdate', this.onTimeUpdate)
          this.video.addEventListener('timeupdate', this.onTimeUpdate)
          this.isLoading = false
        })

        this.video.addEventListener('ended', () => {
          this.isLoading = false
        })

        this.video.addEventListener('error', () => {
          this.$refs.movie.style.height = this.defaultHeight + 'px'
          this.isLoading = false
        })

        this.video.removeEventListener('timeupdate', this.onTimeUpdate)
        this.video.addEventListener('timeupdate', this.onTimeUpdate)
        window.addEventListener('resize', this.onWindowResize)
      }
    }, 0)
  },

  beforeUnmount() {
    this.pause()
    this.video.removeEventListener('timeupdate', this.onTimeUpdate)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    formatFrame,

    formatTime,

    getNaturalDimensions() {
      return {
        height: this.video.videoHeight,
        width: this.video.videoWidth
      }
    },

    getDimensions() {
      const dimensions = this.getNaturalDimensions()
      const ratio = dimensions.height / dimensions.width
      let offsetWidth = 0
      if (this.container.parentElement) {
        const parent = this.container.parentElement.parentElement
        if (parent) offsetWidth = parent.offsetWidth
      }
      let width = Math.min(dimensions.width, offsetWidth)
      if (this.isComparing) {
        // parent is used because sometimes the container width is not
        // properly computed.
        width = Math.min(dimensions.width, offsetWidth / 2)
      }
      let height = Math.floor(width * ratio)
      height = Math.min(height, this.defaultHeight)
      width = Math.floor(height / ratio)
      height = Math.floor(width * ratio)
      height = Math.min(height, this.defaultHeight)
      return { width, height }
    },

    getLastPushedCurrentTime() {
      const length = this.currentTimeCalls.length
      if (length > 0) {
        return this.currentTimeCalls[length - 1]
      } else {
        return this.currentTimeRaw
      }
    },

    setCurrentTimeRaw(currentTime) {
      this.video.currentTime = currentTime
    },

    setCurrentTime(currentTime) {
      if (!this.currentTimeCalls) {
        this.currentTimeCalls = []
      }
      this.currentTimeCalls.push(currentTime)
      if (!this.running) this.runSetCurrentTime()
    },

    runSetCurrentTime() {
      if (this.currentTimeCalls.length === 0) {
        this.running = false
      } else {
        this.running = true
        const currentTime = this.currentTimeCalls.shift()
        // currentTime = roundToFrame(currentTime, this.fps)
        if (this.video.currentTime !== currentTime + this.frameFactor) {
          this.video.currentTime = currentTime + this.frameFactor
        }
        setTimeout(() => {
          this.runSetCurrentTime()
        }, 10)
      }
    },

    configureVideo() {
      this.video.addEventListener('timeupdate', this.onTimeUpdate)
      this.video.onended = this.onVideoEnd
      if (this.video.currentTime === 0) {
        this.mountVideo()
      }
    },

    mountVideo() {
      if (!this.isMovie) return
      this.video.mute = true
      this.videoDuration = this.video.duration
      this.isLoading = false
      this.$emit('duration-changed', this.videoDuration)

      if (this.container) {
        const dimensions = this.getDimensions()
        const width = dimensions.width
        const height = dimensions.height
        if (height > 0) {
          this.container.style.height = this.defaultHeight + 'px'
          // Those two lines are commented out because fixing the width was
          //   breaking the comment section in the preview in full screen
          // this.videoWrapper.style.width = width + 'px'
          // this.video.style.width = width + 'px'
          this.videoWrapper.style.height = height + 'px'
          this.video.style.height = height + 'px'
          this.$emit('size-changed', { width, height })
        }
      }
    },

    onTimeUpdate(time) {
      if (this.video) {
        this.currentTimeRaw = this.video.currentTime - this.frameFactor
      } else {
        this.currentTimeRaw = 0 + this.frameFactor
      }
      this.$emit('time-update', this.currentTimeRaw)
    },

    play() {
      if (!this.isPlaying && this.videoDuration === this.video.currentTime) {
        this.setCurrentTime(0)
      }
      this.video.play()
    },

    pause() {
      this.video.pause()
    },

    toggleMute() {
      this.video.muted = !this.video.muted
    },

    goPreviousFrame() {
      const time = this.getLastPushedCurrentTime()
      const newTime = roundToFrame(time, this.fps) - this.frameFactor
      if (newTime < 0) {
        this.setCurrentTime(0)
      } else {
        this.setCurrentTime(newTime)
      }
      return newTime > 0 ? newTime + this.frameFactor : 0
    },

    goNextFrame() {
      const time = this.getLastPushedCurrentTime()
      const newTime = roundToFrame(time, this.fps) + this.frameFactor
      if (newTime > this.video.duration) {
        this.setCurrentTime(this.video.duration)
      } else {
        this.setCurrentTime(newTime)
      }
      return newTime > 0 ? newTime + this.frameFactor : 0
    },

    onVideoEnd() {
      this.isPlaying = false
      if (this.isRepeating) {
        this.$emit('video-end')
        this.video.currentTime = 0
        this.play()
      } else {
        this.$emit('play-ended')
      }
    },

    onWindowResize() {
      const now = new Date().getTime()
      this.lastCall = this.lastCall || 0
      if (now - this.lastCall > 600) {
        this.lastCall = now
        this.$nextTick(this.mountVideo)
        setTimeout(() => {
          this.mountVideo()
        }, 400)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-background {
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.spinner {
  margin: auto;
}

.video-player {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  height: 100%;
}

.video-wrapper {
  flex: 1;
  display: flex;
  background: black;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: auto;
  width: 100%;
  position: relative;
}

.video-player {
  width: 100%;
  text-align: center;
  background: #36393f;
}

video {
  object-fit: inherit;
}
</style>
