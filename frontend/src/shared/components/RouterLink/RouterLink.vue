<template>
  <q-item clickable tag="router-link" :to="{ name }">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineOptions({
  name: 'RouterLink'
})

defineProps({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: '#'
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>
