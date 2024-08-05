<template>
  <div>
    <CategoriesList class="q-pb-lg" />
    <div class="list">
      <template v-for="app in apps" :key="app.id">
        <AppCard v-bind="app" @click="goAppPage">
          <template v-slot:button>
            <template v-if="app.action?.type">
              <ProgressBar
                :title="app.action.progress * 100 + '%'"
                :progress="app.action.progress"
                :color="appsStore.progressColors(app.action.type).bar"
                :track-color="appsStore.progressColors(app.action.type).track"
                size="33px"
              />
            </template>
            <template v-else-if="appsStore.getButtonState(app) === 'installed'">
              <!-- <q-btn
                class="text-pixelated fit text-body1"
                unelevated
                dense
                color="grey"
                label="Installed"
                disable
                @click.stop
              /> -->
              <AppInstalledBtn />
            </template>
            <template v-else-if="appsStore.getButtonState(app) === 'update'">
              <AppUpdateBtn
                :app="app"
                :loading="appsStore.loadingInstalledApps"
              />
            </template>
            <template v-else>
              <AppInstallBtn
                :app="app"
                :loading="appsStore.loadingInstalledApps"
              />
            </template>
          </template>
        </AppCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ProgressBar } from 'shared/components/ProgressBar'

import { CategoriesList } from 'features/Category/Filter'
import { AppCard, AppInstalledBtn, AppsApi, AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()

import { AppInstallBtn } from 'features/Apps/InstallButton'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

const { fetchAppsShort } = AppsApi

const apps = ref<AppsModel.App[]>([])

onMounted(async () => {
  if (flipperStore.flipperReady) {
    await appsStore.getInstalledApps()
  }
  apps.value = await fetchAppsShort()
})

const router = useRouter()
const goAppPage = (appAlias: string) => {
  router.push({ name: 'AppsPath', params: { path: appAlias } })
}
</script>

<style scoped lang="scss">
@import 'styles';
</style>
