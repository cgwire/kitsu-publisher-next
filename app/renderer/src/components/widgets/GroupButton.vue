<template>
  <div
    :class="{
      'group-button': true,
      [`group-button--${align}`]: true
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'GroupButton',

  props: {
    align: {
      default: 'right',
      type: String,
      validator: (prop) => ['right', 'left', 'center'].includes(prop)
    }
  }
}
</script>

<style lang="scss" scoped>
.group-button {
  display: flex;
  align-items: stretch;

  .button,
  .button.is-primary {
    border-radius: 0;
    height: auto;
  }

  .status-selector:first-child > :first-child,
  .button.is-primary:first-child {
    border-top-left-radius: 2rem;
    border-bottom-left-radius: 2rem;
  }

  .status-selector:last-child > :first-child,
  .button.is-primary:last-child {
    border-top-right-radius: 2rem;
    border-bottom-right-radius: 2rem;
  }
  & > * + *:not(:first-child) {
    border-left: 0;
  }
}
.group-button--right {
  justify-content: flex-end;
}
.group-button--left {
  justify-content: flex-start;
}
.group-button--center {
  justify-content: center;
}
</style>
