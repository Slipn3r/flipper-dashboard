<template>
  <q-btn
    class="text-pixelated fit text-body1"
    unelevated
    dense
    color="positive"
    label="Update"
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
  console.log('Update', props.app)
}
</script>
