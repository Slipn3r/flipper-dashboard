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
        <q-icon name="mdi-alert-circle" color="negative" size="64px" />
        <div class="text-h6 q-my-sm">Outdated app</div>
        <p>Contact the developer to request further app support.</p>
      </q-card-section>

      <q-card-section class="q-pt-none" align="center">
        <q-btn
          outline
          color="primary"
          label="View on GitHub"
          :href="href"
          target="_blank"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
type Props = {
  href: string
}

defineProps<Props>()
</script>
