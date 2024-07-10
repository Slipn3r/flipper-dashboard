<template>
  <q-layout view="lhr LpR lFf">
    <q-page-container>
      <AppsHeader />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { AppsHeader } from 'features/Apps/Header'
</script>
