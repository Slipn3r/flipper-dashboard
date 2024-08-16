<template>
  <q-dialog>
    <q-card class="dialog">
      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
        class="dialog-close-btn"
      />

      <q-card-section class="q-pa-none q-ma-md" align="center">
        <q-icon name="mdi-alert-circle" color="primary" size="64px" />
        <div class="text-h6 q-my-sm">Flipper not connected</div>
        <slot name="description" />
      </q-card-section>

      <q-card-section class="q-pt-none" align="center">
        <slot />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
