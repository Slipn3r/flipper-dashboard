<template>
  <q-btn
    class="button fit"
    padding="xs"
    color="negative"
    outline
    icon="flipper:delete"
    @click.stop="onClick"
    :loading="props.loading"
  />
</template>

<script setup lang="ts">
import { AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()

interface Props {
  app: AppsModel.InstalledApp | AppsModel.App,
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const onClick = () => {
  if (props.app) {
    appsStore.onAction(props.app, 'delete')
  }
}
</script>
