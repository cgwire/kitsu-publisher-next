<template>
  <div class="server-down page has-text-centered">
    <div class="illustration">
      <img src="@/assets/illustrations/500.png">
    </div>
    <h1 class="title">
      {{ $t('server_down.title') }}
    </h1>
    <p>
      {{ $t('server_down.text') }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import auth from '@/lib/auth'

export default {
  name: 'ServerDown',
  computed: {
    ...mapGetters(['isAuthenticated', 'user'])
  },
  methods: {
    ...mapActions([])
  },
  mounted() {
    auth.isServerLoggedIn((err) => {
      const target = this.$store.state.route.query.redirect
      if (!err) {
        this.$router.push(target)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.illustration {
  max-width: 1000px;
  margin: auto;
}

p {
  font-size: 1.3em;
  padding-bottom: 1em;

  a {
    text-decoration: underline;
  }
}
</style>
