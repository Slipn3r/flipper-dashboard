<template>
  <GenericPageLayout
    title="Pulse Plotter"
    icon="flipper:nfc"
    description="Raw Sub-GHz/Infrared/RFID pulse plotter"
  >
    <PulsePlotter />
  </GenericPageLayout>
</template>

<script setup lang="ts">
import { GenericPageLayout } from 'shared/components/GenericPageLayout'
import { PulsePlotter } from 'widgets/PulsePlotter'
</script>
