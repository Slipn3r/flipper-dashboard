<template>
  <q-layout view="lhr LpR lFf">
    <q-page-container>
      <AppsHeader />
      <router-view />
      <AppNoFreeSpaceDialog v-model="appsStore.dialogs.noFreeSpace" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { AppsHeader } from 'features/Apps/Header'
import { AppsModel, AppNoFreeSpaceDialog } from 'entities/Apps'
const appsStore = AppsModel.useAppsStore()
</script>
