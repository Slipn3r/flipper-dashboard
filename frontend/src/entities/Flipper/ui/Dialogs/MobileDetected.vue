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
        <div class="text-h6 q-my-sm">Apps don't work in mobile browsers</div>
        <p>
          Mobile browsers can't connect to Flipper, meaning you won't be able to
          install apps.
        </p>
        <p>Get the official mobile app – it has the same features!</p>
      </q-card-section>

      <q-card-section class="q-pt-none" align="center">
        <q-btn
          outline
          color="primary"
          label="Download app"
          href="https://flpr.app"
          target="_blank"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
