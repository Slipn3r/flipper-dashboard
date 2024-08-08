<template>
  <q-layout view="hhh LpR fff">
    <AppHeader @toggleLeftDrawer="toggleLeftDrawer" />

    <AppDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <template v-if="route.meta.canLoadWithoutFlipper || flipperStore.flipperReady">
        <router-view />
      </template>
      <template v-else>
        <q-page class="flex flex-center fit" padding>
          <FlipperConnectWebBtn />
        </q-page>
      </template>

      <q-dialog v-model="flipperStore.flags.microSDcardMissingDialog">
        <FlipperMicroSDCard isDialog />
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

import { AppHeader, AppDrawer } from './components'

import { FlipperMicroSDCard } from 'widgets/Flipper/Dialogs'
import { FlipperConnectWebBtn } from 'features/Flipper'
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
