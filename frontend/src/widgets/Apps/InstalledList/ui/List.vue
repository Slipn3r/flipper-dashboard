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
    <q-intersection
      v-for="updatableApp in appsStore.updatableApps"
      :key="updatableApp.id"
      once
      transition="scale"
    >
      <AppInstalledCard :app="updatableApp">
        <template v-slot:button>
          <AppUpdateBtn
            :app="updatableApp"
          />
        </template>
      </AppInstalledCard>
    </q-intersection>

    <q-separator
      v-if="appsStore.updatableApps.length && appsStore.upToDateApps.length"
      class="q-my-lg"
    />

    <q-intersection
      v-for="upToDateApp in appsStore.upToDateApps"
      :key="upToDateApp.id"
      once
      transition="scale"
    >
      <AppInstalledCard :app="upToDateApp">
        <template v-slot:button>
          <AppInstalledBtn />
        </template>
      </AppInstalledCard>
    </q-intersection>

    <q-intersection
      v-for="unsupportedApp in appsStore.unsupportedApps"
      :key="unsupportedApp.id"
      once
      transition="scale"
    >
      <AppInstalledCard :app="unsupportedApp" unsupported>
        <template v-slot:button>
          <AppInstalledBtn />
        </template>
      </AppInstalledCard>
    </q-intersection>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { ProgressBar } from 'shared/components/ProgressBar'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { AppInstalledCard } from 'features/Apps/InstalledCard'
import { AppInstalledBtn, AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()

import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { CategoryModel } from 'entities/Category'
const categoriesStore = CategoryModel.useCategoriesStore()

const getCategories = async () => {
  if (!categoriesStore.categories.length ||
    flipperStore.api !== categoriesStore.lastApi ||
    flipperStore.target !== categoriesStore.lastTarget
  ) {
    await categoriesStore.getCategories({
      api: flipperStore.api,
      target: flipperStore.target
    })
  }
}

onMounted(async () => {
  await getCategories()
})

watch(() => flipperStore.flipperReady, async () => {
  await getCategories()
})
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
