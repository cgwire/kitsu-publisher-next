<template>
  <span
    v-if="isLink"
    class="avatar has-text-centered"
    :style="{
      background: person.color,
      width: size + 'px',
      height: size + 'px',
      'min-width': size + 'px',
      'min-height': size + 'px',
      'font-size': person.has_avatar ? 0 : fontSize + 'px'
    }"
  >
    <router-link
      :to="{
        name: 'person',
        params: {
          person_id: person.id
        }
      }"
      :title="person.full_name"
      class="avatar-link"
    >
      <img v-if="person.has_avatar && noCache" :src="avatarPath" />
      <img v-else-if="person.has_avatar" :key="avatarKey" v-lazy="avatarPath" />
      <span v-if="!person.has_avatar">
        {{ initials }}
      </span>
    </router-link>
  </span>

  <span
    v-else
    class="avatar has-text-centered"
    :title="person.full_name"
    :style="{
      background: person.color,
      width: size + 'px',
      height: size + 'px',
      'font-size': fontSize + 'px'
    }"
  >
    <img v-if="person.has_avatar && noCache" :src="avatarPath" />
    <img v-else-if="person.has_avatar" :key="avatarKey" v-lazy="avatarPath" />
    <span v-else>
      {{ initials }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'PersonAvatar',

  props: {
    person: {
      type: Object,
      default: () => ({
        id: 'empty',
        color: '#FFF'
      })
    },
    size: { type: Number, default: 40 },
    'font-size': { type: Number, default: 18 },
    'is-link': { type: Boolean, default: true },
    'no-cache': { type: Boolean, default: false }
  },

  data() {
    return {
      avatarPath: '',
      avatarKey: '',
      initials: ''
    }
  },

  watch: {
    person() {
      this.reloadAvatar()
    },

    'person.uniqueHash'() {
      this.reloadAvatar()
    }
  },

  created() {
    this.reloadAvatar()
  },

  mounted() {
    this.initials = this.person.initials
  },

  methods: {
    reloadAvatar() {
      this.avatarPath =
        `${this.$store.state.login.server}${this.person.avatarPath}?unique=${this.person.uniqueHash}`
      this.avatarKey = this.person.id + '-' + this.person.uniqueHash
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar img {
  max-height: 100%;
  height: 100%;
  width: 100%;
}

.avatar {
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar span {
  flex: 1;
}

.avatar a {
  padding: 0;
  margin: 0;
  color: white;
}

.flexrow-item {
  margin-right: 10px;
}
</style>
