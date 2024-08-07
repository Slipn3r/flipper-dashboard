<template>
  <q-layout view="hhh LpR fff">
    <AppHeader @toggleLeftDrawer="toggleLeftDrawer" />

    <AppDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />

      <q-dialog v-model="flipperStore.flags.microSDcardMissingDialog">
        <FlipperMicroSDCard isDialog />
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AppHeader, AppDrawer } from './components'

import { FlipperMicroSDCard } from 'widgets/Flipper'
import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  if (localStorage.getItem('autoReconnect') !== 'false') {
    flipperStore.flags.autoReconnect = true
  } else {
    flipperStore.flags.autoReconnect = false
  }
})
</script>
