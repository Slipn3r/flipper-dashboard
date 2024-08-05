<template>
  <q-page padding>
    <template v-for="updatableApp in appsStore.updatableApps" :key="updatableApp.id">
      <AppInstalledCard :app="updatableApp">
        <template v-slot:button>
          <AppUpdateBtn
            :app="updatableApp"
          />
        </template>
      </AppInstalledCard>
    </template>

    <q-separator
      v-if="appsStore.updatableApps.length && appsStore.upToDateApps.length"
      class="q-my-lg"
    />

    <template v-for="upToDateApp in appsStore.upToDateApps" :key="upToDateApp.id">
      <AppInstalledCard :app="upToDateApp">
        <template v-slot:button>
          <AppInstalledBtn />
        </template>
      </AppInstalledCard>
    </template>

    <template v-for="unsupportedApp in appsStore.unsupportedApps" :key="unsupportedApp.id">
      <AppInstalledCard :app="unsupportedApp" unsupported>
        <template v-slot:button>
          <AppInstalledBtn />
        </template>
      </AppInstalledCard>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { AppInstalledCard, AppInstalledBtn, AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()

import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

onMounted(async () => {
  if (flipperStore.flipperReady) {
    await appsStore.getInstalledApps()
  }
})
</script>
