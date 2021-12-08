<template>
  <div class="hero is-fullheight">
    <div class="container has-text-centered">
      <div class="box has-text-left">
        <div class="has-text-centered">
          <h1 class="title">
            {{ $t('login.reset_password_title') }}
          </h1>
        </div>

        <div class="field mt2">
          <p class="control has-icon">
            <input
              v-model="server"
              class="input is-medium server"
              type="text"
              :placeholder="$t('login.fields.server')"
              @input="updateServer"
              @keyup.enter="confirmResetPassword"
            />
            <span class="icon">
              <icon name="server" :width="20" height="20" />
            </span>
          </p>
          <p class="control has-icon">
            <input
              v-model="email"
              v-focus
              class="input is-medium email"
              type="text"
              :placeholder="$t('login.fields.email')"
              @input="updateEmail"
              @keyup.enter="confirmResetPassword"
            />
            <span class="icon">
              <icon name="mail" :width="20" height="20" />
            </span>
          </p>
        </div>

        <p class="control">
          <a
            v-if="!isSuccess"
            :class="{
              button: true,
              'main-button': true,
              'is-fullwidth': true,
              'is-loading': isLoading
            }"
            @click="confirmResetPassword"
          >
            {{ $t('login.reset_password') }}
          </a>
        </p>
        <p v-show="isError" class="error">
          {{ $t('login.reset_password_failed') }}
        </p>
        <p v-show="isSuccess" class="success">
          {{ $t('login.reset_password_succeed') }}
        </p>
        <p class="has-text-centered">
          <router-link :to="{ name: 'login' }">
            <span v-if="isSuccess">
              {{ $t('login.back_to_login') }}
            </span>
            <span v-else>
              {{ $t('login.login_page') }}
            </span>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Icon from '@/components/widgets/Icon'

export default {
  name: 'ResetPassword',

  components: {
    Icon
  },

  data() {
    return {
      email: '',
      server: '',
      isLoading: false,
      isError: false,
      isSuccess: false
    }
  },

  computed: {
    ...mapGetters([])
  },

  beforeMount() {
    this.email = this.$store.state.login.email
    this.server = this.$store.state.login.server
  },

  mounted() {
    this.isLoading = false
    this.isSuccess = false
  },

  methods: {
    ...mapActions(['resetPassword']),

    confirmResetPassword() {
      this.isLoading = true
      this.isError = false
      this.isSuccess = false
      this.resetPassword(this.email)
        .then(() => {
          this.isLoading = false
          this.isSuccess = true
        })
        .catch(() => {
          this.isLoading = false
          this.isError = true
          this.isSuccess = false
        })
    },
  
    updateServer(e) {
      this.$store.dispatch('changeServer', e.target.value)
    },

    updateEmail(e) {
      this.$store.dispatch('changeEmail', e.target.value)
    },
  },

  metaInfo() {
    return {
      title: this.$t('login.reset_password_title')
    }
  }
}
</script>

<style lang="scss" scoped></style>
