<template>
  <th
    scope="col"
    class="metadata-descriptor"
    :class="{ 'datatable-row-header': isStick }"
    :style="{ left: left }"
  >
    <div class="flexrow metadata-wrapper-header">
      <department-name
        v-for="department in currentDepartments"
        :key="department.id"
        :department="department"
        :only-dot="true"
        :style="{ padding: '0px 0px' }"
      />
      <span class="flexrow-item descriptor-name">
        {{ descriptor.name }}
      </span>
      <span
        v-if="!noMenu"
        class="metadata-menu-button header-icon"
        @click="$emit('show-metadata-header-menu', $event)"
      >
        <icon name="chevron-down" />
      </span>
    </div>
  </th>
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '@/components/widgets/Icon'
import DepartmentName from '@/components/widgets/DepartmentName'

export default {
  name: 'MetadataHeader',
  props: {
    descriptor: Object,
    isStick: {
      type: Boolean,
      default: false
    },
    left: {
      type: String,
      default: '0px'
    },
    noMenu: {
      type: Boolean,
      default: false
    }
  },
  components: { Icon, DepartmentName },
  computed: {
    ...mapGetters(['departmentMap', 'taskTypeMap']),

    currentDepartments() {
      const departemts = this.descriptor.departments || []
      return departemts.map((departmentId) =>
        this.departmentMap.get(departmentId)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
th.metadata-descriptor {
  min-width: 120px;
  max-width: 120px;
  width: 120px;
  overflow-wrap: break-word;
  hyphens: auto;
}

.metadata-wrapper-header {
  position: relative;
}

.metadata-menu-button {
  background: var(--background);
  border-radius: 50%;
  height: 15px;
  width: 15px;
  position: absolute;
  right: 0;
}
</style>
