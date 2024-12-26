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
        <div class="text-h6 q-my-sm">Unsupported browser</div>
        <p>
          Your browser doesn't support WebSerial API. For better experience we
          recommend using Chrome for desktop.<br />
        </p>
      </q-card-section>
      <q-card-section class="q-pt-none" align="center">
        <q-btn
          outline
          color="primary"
          label="Full list of supported browsers"
          href="https://caniuse.com/web-serial"
          target="_blank"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
