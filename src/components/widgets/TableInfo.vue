<template>
  <div>
    <spinner
      v-if="isLoading && !isError"
      class="table-info"
      :is-stylish="true"
    />
    <div v-if="isError" class="has-text-centered table-info">
      <span class="tag is-danger">
        {{ $t('main.loading_error') }}
      </span>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/widgets/Spinner'

export default {
  name: 'TableInfo',
  components: {
    Spinner
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped></style>
