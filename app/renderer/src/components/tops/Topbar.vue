<template>
  <div class="topbar">
    <div
      id="c-mask-user-menu"
      :class="{ 'is-active': !isUserMenuHidden }"
      @click="toggleUserMenu()"
    />

    <nav class="nav">
      <div class="nav-left">
        <div v-if="!$route.path.startsWith('/todos')" class="nav-item">
          <router-link :to="'/todos'" class="flexrow">
            <icon class="back" name="chevron-left" :width="24" />
            {{ $t('main.go_todos') }}
          </router-link>
        </div>
      </div>

      <div class="nav-right">
        <div
          ref="user-name"
          :class="{
            'nav-item': true,
            'user-nav': true,
            active: !isUserMenuHidden
          }"
          @click="toggleUserMenu"
        >
          <people-avatar
            ref="avatar"
            class="avatar"
            :no-cache="true"
            :person="user"
            :is-link="false"
          />
        </div>
      </div>
    </nav>

    <nav
      ref="user-menu"
      class="user-menu"
      :style="{
        top: isUserMenuHidden ? '-500px' : '60px'
      }"
    >
      <ul>
        <router-link to="/profile" @click="toggleUserMenu()">
          <li>
            {{ $t('main.profile') }}
          </li>
        </router-link>
        <li @click="toggleDarkTheme">
          <span v-if="!isDarkTheme">
            {{ $t('main.dark_theme') }}
          </span>
          <span v-else>
            {{ $t('main.white_theme') }}
          </span>
        </li>
        <hr />
        <a href="https://kitsu.cg-wire.com" target="_blank">
          <li>
            {{ $t('main.documentation') }}
          </li>
        </a>
        <a
          href="https://www.youtube.com/playlist?list=PLp_1gB5ZBHXqnQgZ4TCrAt7smxesaDo29"
          target="_blank"
        >
          <li>
            {{ $t('main.tutorials') }}
          </li>
        </a>
        <!-- TODO : reenable shortcuts>
        <a @click="display.shortcutModal = true">
          <li>
            {{ $t('keyboard.shortcuts') }}
          </li>
        </a>
        -->
        <hr />
        <a href="https://discord.gg/VbCxtKN" target="_blank">
          <li>Discord</li>
        </a>
        <a href="https://cgwire.canny.io" target="_blank">
          <li>Roadmap / Feedback</li>
        </a>
        <hr />
        <a href="https://cg-wire.com/en/about.html" target="_blank">
          <li>
            {{ $t('main.about') }}
          </li>
        </a>
        <li class="version">Kitsu Publisher {{ kitsuPublisherVersion }}</li>
        <hr />
        <router-link to="/settings" @click="toggleUserMenu()">
          <li class="flexrow">
            <icon name="settings" class="icon flexrow-item" />
            <span class="flexrow-item">{{ $t('main.settings') }}</span>
          </li>
        </router-link>
        <hr />
        <li class="flexrow" @click="onLogoutClicked">
          <icon name="log-out" class="icon flexrow-item" />
          <span class="flexrow-item">{{ $t('main.logout') }}</span>
        </li>
      </ul>
    </nav>

    <shortcut-modal
      :active="display.shortcutModal"
      @cancel="display.shortcutModal = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Icon from '@/components/widgets/Icon'

import PeopleAvatar from '@/components/widgets/PeopleAvatar'
import ShortcutModal from '@/components/modals/ShortcutModal'

export default {
  name: 'Topbar',
  components: {
    Icon,
    PeopleAvatar,
    ShortcutModal
  },

  data() {
    return {
      kitsuPublisherVersion: window.electron.config.get('appVersion'),
      display: {
        shortcutModal: false
      }
    }
  },

  computed: {
    ...mapGetters(['isDarkTheme', 'isUserMenuHidden', 'user'])
  },

  methods: {
    ...mapActions(['logout', 'toggleDarkTheme', 'toggleUserMenu']),

    onLogoutClicked() {
      this.logout((err, success) => {
        this.$socket.destroy()
        if (err) console.error(err)
        this.toggleUserMenu()
        if (success) this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  a,
  .user-menu ul a {
    color: $white-grey;
  }

  #toggle-menu-button:hover {
    color: $white-grey;
  }

  .topbar .nav,
  .user-menu {
    background-color: $black;
    color: $white-grey;
    border-left: 1px solid #2f3136;
    border-bottom: 1px solid #2f3136;
  }

  .changelog-button {
    color: $grey;
  }

  hr {
    background-color: $grey-strong;
  }

  .user-menu li {
    &:not(.version):hover {
      background: $dark-grey-light;
    }
  }
}

.nav {
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
  max-height: 60px;
  min-height: 60px;
  z-index: 204;
  position: fixed;
  left: 0;
  right: 0;
}

#toggle-menu-button {
  font-size: 2em;
}

.avatar {
  margin-right: 10px;
  min-width: 40px;
}

.user-nav {
  cursor: pointer;
}

.user-nav.active {
}

.user-menu {
  position: fixed;
  width: 220px;
  min-width: 220px;
  right: 0;
  background-color: white;
  padding: 1em 1em 1em 1em;
  z-index: 203;
  box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
  border-left: 1px solid $white-grey;
  border-bottom: 1px solid $white-grey;
  transition: top 0.5s ease;
}

.user-menu ul {
  margin-left: 0;
}

.user-menu li {
  cursor: default;
  padding: 0.2em;
  padding-left: 0.4em;
  font-size: 1.1em;
  list-style-type: none;

  &:not(.version):hover {
    cursor: pointer;
    background: $white-grey;
    border-radius: 5px;
  }
}

.user-menu ul a {
  color: #333;
}

#c-mask-user-menu {
  position: fixed;
  z-index: 202;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  background-color: #000;
  opacity: 0;
}

#c-mask-user-menu.is-active {
  width: 100%;
  height: 100%;
}

.nav-right {
  margin-left: auto;
  padding-right: 0;
  flex-grow: 0;
}

.context-selector-label {
  margin-right: 1em;
}

.context-selector {
  margin-top: 23px;
  margin-right: 1em;
}

.icon-link {
  margin: 0 0.5em;
}

strong {
  margin-right: 1em;
}

.version {
  color: $grey;
}

.changelog-button {
  background: transparent;
  color: $light-grey;
  cursor: pointer;
}

.topbar-menu {
  padding: 10px;
}

.back {
  padding-top: 6px;
  margin-right: 2px;
  color: $grey;
}

.section-path {
  padding-top: 5px;
}

.icon {
  vertical-align: middle;
}

@media screen and (max-width: 768px) {
  .home-button {
    display: none;
  }

  .nav-right {
    display: flex;
    flex: 0;
  }

  .nav-item {
    justify-content: right;
  }

  .user-name {
    display: none;
  }

  .avatar {
    margin-right: 0;
  }

  .user-menu {
    right: -160;
  }

  .icon-link,
  .context-selector-label {
    display: none;
  }

  .field.context-selector {
    padding: 0;
    margin-top: 2em;
  }
}
</style>
