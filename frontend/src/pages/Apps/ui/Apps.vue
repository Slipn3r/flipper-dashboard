<template>
  <q-page padding>
    <template v-if="!globalStore.isOnline">
      <FlipperNoInternetConnectionCard flat />
    </template>
    <AppCatalog v-else />
  </q-page>
</template>

<script setup>
import { AppCatalog } from 'widgets/Apps/AppCatalog'

import { useGlobalStore } from 'shared/stores/global-store'
const globalStore = useGlobalStore()

import { FlipperNoInternetConnectionCard } from 'entity/Flipper'
</script>
