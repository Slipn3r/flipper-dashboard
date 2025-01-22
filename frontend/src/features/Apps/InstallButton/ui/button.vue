<template>
  <q-btn
    class="text-pixelated fit text-body1"
    unelevated
    dense
    color="primary"
    label="Install"
    @click.stop="onClick"
    :loading="props.loading"
  />
</template>

<script setup lang="ts">
import { AppsModel } from 'entity/Apps'
const appsStore = AppsModel.useAppsStore()

interface Props {
  app?: AppsModel.App
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const onClick = () => {
  if (props.app) {
    appsStore.onAction(props.app, 'install')
  }
}
</script>
