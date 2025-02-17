<template>
  <q-card class="rounded-borders" :flat="flat" :class="{ dialog: isDialog }">
    <template v-if="isDialog">
      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
        class="dialog-close-btn"
      />
    </template>

    <q-card-section class="q-pa-none q-ma-md" align="center">
      <q-img src="~assets/no_internet.svg" width="128px" no-spinner />
      <div class="text-h6 q-my-sm">No Internet Connection</div>
      <p>Check the network settings</p>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
type Props = {
  flat?: boolean
  isDialog?: boolean
}

withDefaults(defineProps<Props>(), {
  flat: false,
  isDialog: false
})
</script>
