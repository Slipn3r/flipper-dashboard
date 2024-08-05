<template>
  <q-chip
    :style="`background-color: #${color}; opacity: ${
      isCurrentCategory ? '1' : '0.5'
    }`"
    :clickable="clickable"
    @click="onClick"
  >
    <q-icon
      v-if="iconUri"
      :name="`img:${iconUri}`"
      size="14px"
      class="q-my-xs q-mr-sm"
    />
    <span class="text-no-wrap">{{ name }}</span>
  </q-chip>
</template>

<script setup lang="ts">
import type { CategoryData } from '../model/types'

type Props = Omit<CategoryData, 'applications' | 'priority' | '_id'> & {
  // iconUri?: string
  isCurrentCategory?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  isCurrentCategory: false,
  clickable: true
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>
