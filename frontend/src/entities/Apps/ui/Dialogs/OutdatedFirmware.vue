<script setup lang="ts">
type Props = {
  persistent?: boolean
}

withDefaults(defineProps<Props>(), {
  persistent: false
})
</script>

<template>
  <q-dialog :persistent>
    <q-card class="dialog">
      <q-btn
        v-if="!persistent"
        icon="close"
        flat
        round
        dense
        v-close-popup
        class="dialog-close-btn"
      />

      <q-card-section class="q-pa-none q-ma-md" align="center">
        <q-icon name="mdi-alert-circle" color="negative" size="64px" />
        <div class="text-h6 q-my-sm">Outdated Firmware Version</div>
        <p>
          Firmware version on your Flipper does not support this app.<br />Click
          the button below to update your device.
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none" align="center">
        <q-btn
          outline
          color="primary"
          label="Update"
          @click="$router.push({ name: 'Device' })"
          v-close-popup
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
