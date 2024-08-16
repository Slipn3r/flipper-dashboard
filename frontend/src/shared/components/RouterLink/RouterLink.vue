<template>
  <q-item clickable tag="router-link" :to="{ name }">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <template v-if="titleOverride">
          {{ titleOverride }}
        </template>
        <template v-else>
          {{ title }}
        </template>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ComputedRef } from 'vue'

defineOptions({
  name: 'RouterLink'
})

type Props = {
  title: string
  titleOverride?: ComputedRef<string>
  name: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  titleOverride: undefined,
  name: '#',
  icon: ''
})
</script>
