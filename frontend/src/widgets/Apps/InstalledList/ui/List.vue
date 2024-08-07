<template>
  <q-page padding>
    <div
      v-if="appsStore.updatableApps.length"
      style="width: 140px"
      class="q-mb-md q-pl-md"
    >
      <template v-if="appsStore.batch.inProcess">
        <ProgressBar
          :title="`${appsStore.batch.doneCount} / ${appsStore.batch.totalCount}`"
          :progress="appsStore.batch.doneCount / appsStore.batch.totalCount + appsStore.batch.progress / appsStore.batch.totalCount"
          color="positive"
          trackColor="green-4"
          size="33px"
        />
      </template>
      <template v-else>
        <q-btn
          class="fit text-pixelated text-body1"
          unelevated
          dense
          color="positive"
          label="Update all"
          @click="appsStore.batchUpdate(appsStore.updatableApps)"
        >
          <q-badge
            class="update-all-badge"
            :label="appsStore.appsUpdateCount"
          />
        </q-btn>
      </template>
    </div>
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
import { ProgressBar } from 'shared/components/ProgressBar'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { AppInstalledCard } from 'features/Apps/InstalledCard'
import { AppInstalledBtn, AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
