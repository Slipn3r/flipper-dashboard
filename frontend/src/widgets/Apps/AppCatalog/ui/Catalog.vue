<template>
  <div>
    <template v-if="categoriesStore.categoriesLoading">
      <Loading label="Loading categories..." />
    </template>
    <template v-else-if="appsStore.flags.catalogIsUnknownSDK">
      <q-card flat>
        <q-card-section class="q-pa-none q-ma-md" align="center">
          <q-img src="~assets/flipper_alert.svg" width="70px" no-spinner />
          <div class="text-h6 q-my-sm">Not Compatible with your Firmware</div>
          <p>
            To access Apps, install the latest firmware version from
            <span class="text-positive text-bold">Release</span> Channel on your
            Flipper
          </p>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn
            outline
            no-caps
            label="Go to Firmware update"
            color="blue-6"
            :to="{ name: 'Device' }"
          />
        </q-card-actions>
      </q-card>
    </template>
    <div
      v-show="
        !categoriesStore.categoriesLoading &&
        !appsStore.flags.catalogIsUnknownSDK
      "
      class="q-mb-lg"
      :class="{
        row: !$q.screen.lt.md,
        column: $q.screen.lt.md
      }"
    >
      <CategoriesList
        :class="{
          'q-mr-md': !$q.screen.lt.md,
          'q-mb-md justify-center': $q.screen.lt.md
        }"
        class="col"
        @categorySelected="onCategorySelected"
      />
      <div class="column col-auto q-col-gutter-sm">
        <q-select
          class="col"
          v-model="sortModel"
          @update:model-value="onSortApps()"
          :options="sortOptions"
          dense
          standout="bg-primary text-white no-shadow"
          rounded
        />
        <template v-if="appsStore.flags.catalogInstallAllApps">
          <div class="col">
            <AppInstallAll :disabled="appsStore.loadingInstalledApps" />
          </div>
        </template>
      </div>
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
              <template v-if="app.action?.type || getAppAction(app)">
                <ProgressBar
                  :title="app.action.progress * 100 + '%'"
                  :progress="app.action.progress"
                  :color="appsStore.progressColors(app.action.type).bar"
                  :track-color="appsStore.progressColors(app.action.type).track"
                  interpolated
                  size="33px"
                />
              </template>
              <template
                v-else-if="appsStore.getButtonState(app) === 'installed'"
              >
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
          <Loading label="Loading apps..." />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import type { AxiosError } from 'axios'
import type { ApiErrorDetail } from 'shared/types/api'

import { showNotif } from 'shared/lib/utils/useShowNotif'

import { ProgressBar } from 'shared/components/ProgressBar'
import { Loading } from 'shared/components/Loading'

import { CategoriesList } from 'features/Category/Filter'
import { CategoryModel } from 'entities/Category'
const categoriesStore = CategoryModel.useCategoriesStore()

import { AppCard, AppInstalledBtn, AppsApi, AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppsStore()

import { AppInstallBtn } from 'features/Apps/InstallButton'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { AppInstallAll } from 'features/Apps/InstallAll'
import { FlipperModel } from 'entities/Flipper'
import { type QInfiniteScroll } from 'quasar'

const flipperStore = FlipperModel.useFlipperStore()

const { fetchAppsShort } = AppsApi

const appsLoading = ref(false)
const apps = ref<AppsModel.App[]>([])

const limit = ref(48)
const offset = ref(0)
const getApps = async () => {
  if (flipperStore.flipperReady) {
    if (flipperStore.rpcActive) {
      if (
        !flipperStore.flipper?.info?.firmware.api ||
        !flipperStore.flipper?.info?.firmware.target
      ) {
        appsStore.dialogs.outdatedFirmwareDialog = true
        appsStore.dialogs.outdatedFirmwareDialogPersistent = true

        fetchEnd.value = true
        return
      }
    }
  }

  appsLoading.value = true

  let newApps: AppsModel.App[] = []
  if (!fetchEnd.value) {
    await fetchAppsShort({
      limit: limit.value,
      offset: offset.value,
      category_id: categoriesStore.currentCategory?.id,
      api:
        flipperStore.api && flipperStore.target ? flipperStore.api : undefined,
      target:
        flipperStore.api && flipperStore.target
          ? flipperStore.target
          : undefined,
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
      .catch((error: AxiosError<ApiErrorDetail>) => {
        fetchEnd.value = true

        if (error.response?.data.detail.code === 1001) {
          appsStore.flags.catalogIsUnknownSDK = true
        } else {
          showNotif({
            message: 'Unable to load applications.',
            color: 'negative',
            actions: [
              {
                label: 'Reload',
                color: 'white',
                handler: () => {
                  reLoad()
                }
              }
            ]
          })
        }
      })
  }

  appsLoading.value = false
}

const getAppAction = (app: AppsModel.App) => {
  const actionApp = appsStore.actionAppList.find((_app) => {
    if (_app.id === app.id) {
      return true
    }

    return false
  })

  if (actionApp) {
    app.action = actionApp.action

    return true
  }

  return false
}

onMounted(async () => {
  appsStore.flags.catalogIsUnknownSDK = false

  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      await flipperStore.flipper?.startRPCSession()
    }

    if (flipperStore.flipper?.readingMode.type === 'rpc') {
      if (!flipperStore.info) {
        await flipperStore.flipper?.getInfo()
      }

      // await reLoad()

      if (
        !appsStore.loadingInstalledApps &&
        !appsStore.flipperInstalledApps?.length
      ) {
        await appsStore.getInstalledApps({
          refreshInstalledApps: true
        })
      }
    }
  }
})

// watch(
//   () => flipperStore.flipperReady,
//   async () => {
//     await reLoad()
//   }
// )

watch(
  () => appsStore.flags.catalogChannelProduction,
  async () => {
    if (flipperStore.flipper?.readingMode.type === 'rpc') {
      await appsStore.getInstalledApps({
        refreshInstalledApps: true
      })
    }
  }
)

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
  console.log('onLoad')
  if (index > 1) {
    offset.value += limit.value
  }

  await getApps()
  done(fetchEnd.value)
}

const onCategorySelected = async () => {
  await reLoad()
}

const router = useRouter()
const goAppPage = (appAlias: AppsModel.App['alias']) => {
  router.push({ name: 'AppsPath', params: { path: appAlias } })
}
</script>

<style scoped lang="scss">
@import 'styles';
</style>
