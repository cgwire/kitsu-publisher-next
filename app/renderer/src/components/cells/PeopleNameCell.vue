<template>
  <td
    scope="row"
    class="name"
  >
    <div class="people-name">
      <people-avatar
        class="avatar"
        :is-link="false"
        :person="person"
      />
      <people-name
        class="people-name"
        :person="person"
      />
    </div>
  </td>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PeopleAvatar from '@/components/widgets/PeopleAvatar'
import PeopleName from '@/components/widgets/PeopleName'

export default {
  name: 'PeopleNameCell',
  components: {
    PeopleName,
    PeopleAvatar
  },

  props: {
    person: {
      type: Object,
      required: true
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
.people-name {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.people-name {
  margin-left: 0.6em;
}
</style>
