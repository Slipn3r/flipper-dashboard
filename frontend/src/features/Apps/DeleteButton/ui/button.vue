<template>
  <q-btn
    class="button fit"
    color="negative"
    outline
    icon="flipper:delete"
    @click="onClick"
  />
</template>

<script setup>
const props = defineProps({
  app: {
    type: Number,
    required: true
  }
})

const onClick = () => {
  console.log('Delete', props.app)
}
</script>
