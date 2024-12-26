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
        <q-icon name="svguse:common-icons.svg#fw-conflict-icon" size="64px" />
        <div class="text-h6 q-my-sm">No Free Space</div>
        <p>
          There is no empty space to install this application.<br />Use archive
          to delete needless files.
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none" align="center">
        <q-btn
          outline
          color="primary"
          label="Open Archive"
          @click="$router.push({ name: 'Archive' })"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
