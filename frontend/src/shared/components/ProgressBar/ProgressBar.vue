<template>
  <q-linear-progress
    rounded
    :size="size"
    :value="progress"
    :instant-feedback="interpolated"
    :color="color"
    :track-color="trackColor"
  >
    <div
      v-if="title"
      class="absolute-full flex flex-center text-HaxrCorp rounded-borders bordered"
    >
      <template v-if="!noBadge">
        <q-badge
          class="text badge"
          :color="badgeColor"
          :text-color="titleColor || color"
          :label="title"
          :style="`font-size: ${titleSize}`"
        />
      </template>
      <template v-else>
        <p
          class="q-mb-none text"
          :class="{'text-white': !titleColor?.length}"
          :style="`font-size: ${titleSize}`"
        >{{ title }}</p>
      </template>
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
type Props = {
  size?: string
  color?: string
  trackColor?: string
  badgeColor?: string
  title?: string
  titleSize?: string
  titleColor?: string
  progress: number
  noBadge?: boolean
  interpolated?: boolean
}
withDefaults(defineProps<Props>(), {
  size: '2.25rem',
  color: 'positive',
  trackColor: 'grey-4',
  badgeColor: 'white',
  titleSize: '28px',
  noBadge: false,
  interpolated: false
})
</script>

<style lang="scss" scoped>
@import 'styles'
</style>
