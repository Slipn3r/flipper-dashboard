<template>
  <q-item clickable tag="a" target="_blank" :href="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { EssentialLinkProps } from './types'

defineOptions({
  name: 'EssentialLink'
})

withDefaults(defineProps<EssentialLinkProps>(), {
  link: '#',
  icon: ''
})
</script>
