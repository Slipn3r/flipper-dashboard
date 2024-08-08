<template>
  <div>
    <div
      class="q-mb-lg"
      :class="{
        'row': $q.screen.gt.md,
        'column': !$q.screen.gt.md
      }"
    >
      <CategoriesList
        :class="{
          'q-mr-md': $q.screen.gt.md,
          'q-mb-md justify-center': !$q.screen.gt.md
        }"
        class="col"
        @categorySelected="onCategorySelected"
      />
      <q-select
        class="col-auto"
        v-model="sortModel"
        @update:model-value="onSortApps()"
        :options="sortOptions"
        dense
        standout="bg-primary text-white no-shadow"
        rounded
      />
    </div>
    <q-infinite-scroll
      ref="infinityScrollRef"
      v-if="!categoriesStore.categoriesLoading"
      @load="onLoad"
      :offset="500"
      class="full-width"
    >
      <div class="list">
        <q-intersection
          v-for="app in apps"
          :key="app.id"
          once
          transition="scale"
        >
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
        </q-intersection>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <Loading
            label="Loading apps..."
          />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { ProgressBar } from 'shared/components/ProgressBar'
import { Loading } from 'shared/components/Loading'

import { CategoriesList } from 'features/Category/Filter'
import { CategoryModel } from 'entities/Category'
const categoriesStore = CategoryModel.useCategoriesStore()

import { AppCard, AppInstalledBtn, AppsApi, AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()

import { AppInstallBtn } from 'features/Apps/InstallButton'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { FlipperModel } from 'entities/Flipper'
import { type QInfiniteScroll } from 'quasar'
const flipperStore = FlipperModel.useFlipperStore()

const { fetchAppsShort } = AppsApi

const appsLoading = ref(false)
const apps = ref<AppsModel.App[]>([])

const limit = ref(48)
const offset = ref(0)
const getApps = async () => {
  appsLoading.value = true

  let newApps: AppsModel.App[] = []
  if (!fetchEnd.value) {
    await fetchAppsShort({
      limit: limit.value,
      offset: offset.value,
      category_id: categoriesStore.currentCategory?.id,
      api: flipperStore.api || undefined,
      target: flipperStore.target || undefined,
      sort_by: getAppsShort(sortModel.value).sort_by,
      sort_order: getAppsShort(sortModel.value).sort_order
    })
      .then((res: AppsModel.App[]) => {
        if (!res) {
          fetchEnd.value = true
          return
        }

        newApps = res

        if (!newApps.length) {
          fetchEnd.value = true
        } else {
          apps.value.push(...newApps)
        }

        if (newApps.length < limit.value) {
          fetchEnd.value = true
        }
      })
        .catch(() => {
          fetchEnd.value = true
          // showNotif({
          //   message: 'Unable to load applications.',
          //   color: 'negative',
          //   actions: [{ label: 'Reload', color: 'white', handler: () => { location.reload() } }]
          // })
        })
  }

  appsLoading.value = false
}

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      await flipperStore.flipper.startRPCSession()
    }

    if (flipperStore.flipper.readingMode.type === 'raw') {
      if (!flipperStore.info) {
        await flipperStore.flipper.getInfo()
      }

      reLoad()

      if (!appsStore.flipperInstalledApps.length) {
        await appsStore.getInstalledApps({
          refreshInstalledApps: true
        })
      }
    }
  }
})

watch(() => flipperStore.flipperReady, () => {
  reLoad()
})

const sortModel = ref('New Updates')
const sortOptions = ref([
  'New Updates',
  'New Releases',
  'Old Updates',
  'Old Releases'
])
const getAppsShort = (sort: string) => {
  switch (sort) {
    case 'Old Updates':
      return {
        sort_by: 'updated_at',
        sort_order: 1
      }
    case 'New Releases':
      return {
        sort_by: 'created_at',
        sort_order: -1
      }
    case 'Old Releases':
      return {
        sort_by: 'created_at',
        sort_order: 1
      }
    default:
      return {
        sort_by: 'updated_at',
        sort_order: -1
      }
  }
}
const onSortApps = () => {
  reLoad()
}

const fetchEnd = ref(false)
const infinityScrollRef = ref<QInfiniteScroll>()
const reLoad = async () => {
  apps.value = []
  fetchEnd.value = false
  offset.value = 0

  if (infinityScrollRef.value) {
    infinityScrollRef.value.stop()
    infinityScrollRef.value.reset()
    nextTick(() => {
      infinityScrollRef.value?.resume()
    })
  }
}
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  if (index > 1) {
    offset.value += limit.value
  }

  await getApps()
  done(fetchEnd.value)
}

const onCategorySelected = () => {
  reLoad()
}

const router = useRouter()
const goAppPage = (appAlias: string) => {
  router.push({ name: 'AppsPath', params: { path: appAlias } })
}
</script>

<style scoped lang="scss">
@import 'styles';
</style>
