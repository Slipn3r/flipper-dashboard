<template>
  <div>
    <CategoriesList class="q-pb-lg" />
    <div class="list">
      <template v-for="app in apps" :key="app.id">
        <AppCard class="col-3" v-bind="app" @click="goAppPage">
          <template v-slot:button>
            <AppInstallBtn :app="app" />
            <!-- <AppUpdateBtn :app="n" /> -->
          </template>
        </AppCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import { CategoriesList } from 'features/Category/Filter'
import { AppCard, AppsApi, AppsModel } from 'entities/Apps'
import { AppInstallBtn } from 'features/Apps/InstallButton'
// import { AppUpdateBtn } from 'features/Apps/UpdateButton'

const { fetchAppsShort } = AppsApi

const apps: Ref<AppsModel.App[]> = ref([])

onMounted(async () => {
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
