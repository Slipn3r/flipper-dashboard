<template>
  <q-btn
    class="text-pixelated fit text-body1"
    unelevated
    dense
    color="primary"
    label="Install"
    @click="onClick"
  />
</template>

<script setup>
import { AppsModel } from 'entities/Apps'

const props = defineProps({
  app: {
    type: AppsModel.App,
    required: true
  }
})
const onClick = () => {
  console.log('Install', props.app)
}
</script>
