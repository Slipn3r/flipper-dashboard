<template>
  <div class="column items-center">
    <q-spinner
      color="primary"
      size="3em"
      class="q-mb-md"
    ></q-spinner>
    <p>{{ props.label }}</p>
  </div>
</template>

<script setup lang="ts">
type Props = {
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Loading...'
})
</script>
