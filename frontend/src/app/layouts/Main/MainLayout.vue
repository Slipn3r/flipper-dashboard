<template>
  <q-layout view="hhh LpR fff">
    <AppHeader @toggleLeftDrawer="toggleLeftDrawer" />

    <AppDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { AppHeader, AppDrawer } from './components'

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
