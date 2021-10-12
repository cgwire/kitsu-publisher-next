module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    'vue/no-deprecated-slot-attribute': 'off', // TODO : TO FIX
    'vue/no-deprecated-slot-scope-attribute': 'off', // TODO : TO FIX
    'vue/require-explicit-emits': 'off', // TODO : TO FIX
    'vue/no-use-v-if-with-v-for': 'off' // TODO : TO FIX
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
