<template>
  <q-page padding>
    <template v-if="appsStore.loadingInstalledApps">
      <Loading label="Loading installed apps..." />
    </template>
    <template v-else-if="!flipperStore.flags.connected">
      <q-card flat>
        <q-card-section class="q-pa-none q-ma-md" align="center">
          <q-icon name="mdi-alert-circle" color="primary" size="64px" />
          <div class="text-h6 q-my-sm">Flipper not connected</div>
        </q-card-section>
      </q-card>
    </template>
    <template
      v-else-if="!flipperStore.info?.storage.sdcard?.status.isInstalled"
    >
      <div class="column items-center">
        <FlipperMicroSDCard
          flat
          :showFindMicroSdBtn="flipperStore.isElectron"
          @onFindMicroSd="flipperStore.findMicroSd"
        />
      </div>
    </template>
    <template v-else-if="appsStore.noApplicationsInstalled">
      <div class="column items-center">
        <q-card flat>
          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="primary" size="64px" />
            <div class="text-h6 q-my-sm">
              You haven't installed any apps yet
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
    <template v-else-if="!flipperStore.flags.flipperIsInitialized">
      <InstalledList />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { Loading } from 'shared/components/Loading'
import { FlipperMicroSDCard } from 'entity/Flipper'
import { InstalledList } from 'widgets/Apps/InstalledList'
import { AppsModel } from 'entity/Apps'
const appsStore = AppsModel.useAppsStore()

import { FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()
</script>
