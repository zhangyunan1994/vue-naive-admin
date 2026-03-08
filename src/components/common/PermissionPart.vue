<template>
  <slot v-if="hasPermission" />
</template>

<script setup>
const props = defineProps({
  permission: {
    type: [String, Array],
    required: true,
  },
})

const route = useRoute()
const hasPermission = computed(() => {
  const btns = route.meta?.btns?.map(item => item.code) || []
  const codes = Array.isArray(props.permission) ? props.permission : [props.permission]
  return codes.some(code => btns.includes(code))
})
</script>
