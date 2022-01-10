<template>
  <router-link
    v-if="withLink"
    class="person-name"
    :to="{
      name: 'person',
      params: {
        person_id: person.id
      }
    }"
    :title="person.full_name"
  >
    {{ person.first_name + ' ' + person.last_name }}
  </router-link>
  <span v-else class="person-name">
    {{ person.first_name + ' ' + person.last_name }}
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PersonName',
  props: {
    person: {
      type: Object,
      required: true
    },
    withLink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions([])
  }
}
</script>

<style lang="scss" scoped>
.person-name {
  color: var(--text);
}
</style>
