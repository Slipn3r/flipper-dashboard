<template>
  <q-header class="bg-transparent text-black q-pa-lg">
    <q-toolbar class="row justify-end items-center q-pa-none">
      <div>
        <q-btn
          v-if="showBackButton"
          class="q-mr-md"
          flat
          round
          dense
          @click="goCatalog"
        >
          <q-icon name="mdi-chevron-left" size="56px" />
        </q-btn>
        <q-icon v-else class="q-mr-md" name="flipper:apps" size="56px" />
      </div>
      <h4 class="q-ma-none text-h4">Apps</h4>
      <q-space />
      <div
        v-if="globalStore.isOnline"
        class="column relative-position justify-center"
      >
        <q-input
          class="q-mr-md text-black"
          style="width: 300px"
          v-model.trim="searchText"
          input-class="text-black"
          bg-color="grey-3"
          rounded
          dense
          standout="no-shadow text-black"
          type="text"
          label="Search"
          debounce="400"
          @update:model-value="
            (val: string | number | null) => search(String(val))
          "
          :disable="appsStore.flags.catalogIsUnknownSDK"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-magnify" class="text-grey-7" />
          </template>
        </q-input>
        <q-list
          v-if="searchText.length >= 2"
          bordered
          class="absolute bg-white rounded-borders z-top"
          style="width: 270px; top: 43px"
        >
          <template v-if="searchResult.length">
            <q-item
              v-for="app in searchResult"
              :key="app.id"
              clickable
              dense
              v-ripple
              @click="goAppPage(app.alias)"
            >
              <q-item-section v-if="app.currentVersion" avatar>
                <q-avatar square size="24px" style="margin: 4px">
                  <img
                    :src="app.currentVersion.iconUri"
                    style="image-rendering: pixelated"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ app.currentVersion.name }}</q-item-section>
            </q-item>
          </template>
          <template v-else-if="!searchLoading">
            <q-item dense>
              <q-item-section class="text-grey-7">Nothing found</q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
      <q-btn
        class="q-mr-xs text-weight-regular"
        flat
        rounded
        no-caps
        :color="$route.name === 'InstalledApps' ? 'primary' : 'black'"
        icon="flipper:installed"
        label="Installed"
        :to="{ name: 'InstalledApps' }"
        :disable="appsStore.flags.catalogIsUnknownSDK"
      >
        <q-badge
          v-if="
            $q.screen.width > 365 &&
            appsStore.appsUpdateCount > 0 &&
            globalStore.isOnline
          "
          color="positive"
          floating
          class="outdated-badge"
          :label="appsStore.appsUpdateCount"
        />
      </q-btn>
      <q-btn
        class="text-weight-regular"
        flat
        rounded
        no-caps
        color="black"
        icon="mdi-github"
        label="Contribute"
        href="https://github.com/flipperdevices/flipper-application-catalog"
        target="_blank"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppsModel, AppsApi } from 'entity/Apps'
const appsStore = AppsModel.useAppsStore()

const { fetchAppsShort } = AppsApi

import { FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { CategoryModel } from 'entity/Category'
const categoriesStore = CategoryModel.useCategoriesStore()

import { useGlobalStore } from 'shared/stores/global-store'
const globalStore = useGlobalStore()

const searchText = ref('')
const searchLoading = ref(false)
const searchResult = ref<AppsModel.App[]>([])
const search = async (val: string) => {
  if (val.length < 3) {
    return
  }

  type Params = {
    limit: number
    offset: number
    sort_by: string
    sort_order: number
    is_latest_release_version?: boolean
    api?: string
    target?: string
    query: string
  }

  const params: Params = {
    limit: 8,
    offset: 0,
    sort_by: 'updated_at',
    sort_order: -1,
    is_latest_release_version: true,
    query: val
  }

  const api = flipperStore.api
  const target = flipperStore.target
  if (api || target) {
    delete params.is_latest_release_version

    if (target) {
      params.target = target
    }
    if (api) {
      params.api = api
    }
  }

  searchLoading.value = true
  await fetchAppsShort(params)
    .then((apps: AppsModel.App[]) => {
      searchResult.value = apps
    })
    .catch((error) => {
      console.error(error)
      searchResult.value = []
    })
  searchLoading.value = false
}

const goAppPage = (appAlias: AppsModel.App['alias']) => {
  router.push({ name: 'AppsPath', params: { path: appAlias } })
  searchText.value = ''
  searchResult.value = []
}

const route = useRoute()
const router = useRouter()

const showBackButton = computed(
  () => route.name === 'AppsPath' || route.name === 'InstalledApps'
)

const goCatalog = () => {
  if (categoriesStore.currentCategory) {
    router.push({
      name: 'AppsCategory',
      params: { path: categoriesStore.currentCategory.name.toLowerCase() }
    })
  } else {
    router.push({ name: 'Apps' })
  }
}
</script>
