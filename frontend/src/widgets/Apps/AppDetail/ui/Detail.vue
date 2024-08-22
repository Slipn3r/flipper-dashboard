<template>
  <div class="app">
    <template v-if="loading">
      <Loading label="Loading app..." />
    </template>
    <template v-else-if="currentApp">
      <div class="row items-center q-mb-lg">
        <div class="row col">
          <div class="app__icon-wrapper q-mr-md">
            <q-img
              :src="currentApp.currentVersion.iconUri"
              style="image-rendering: pixelated"
            />
          </div>
          <div class="col">
            <h2 class="text-h6 q-ma-none q-mb-xs">
              {{ currentApp.currentVersion.name }}
            </h2>
            <div class="row items-center q-gutter-x-md">
              <div>
                <CategoryChip
                  v-if="category"
                  v-bind="category"
                  @click="goCategory"
                  isCurrentCategory
                />
              </div>
              <p class="q-mb-none">
                <span class="text-grey-7 q-mr-xs">Version:</span>
                <span class="text-bold">
                  {{ currentApp.currentVersion.version }}
                </span>
              </p>
              <p class="q-mb-none">
                <span class="text-grey-7 q-mr-xs">Size:</span>
                <span class="text-bold">
                  {{
                    bytesToSize(
                      currentApp.currentVersion.currentBuild.metadata.length
                    )
                  }}
                </span>
              </p>
              <template v-if="getStatusHint">
                <q-chip
                  :class="{ 'no-pointer-events': !getStatusHint.dialog }"
                  :color="getStatusHint.color"
                  :icon="getStatusHint.icon"
                  :label="getStatusHint.text"
                  :clickable="!!getStatusHint.dialog"
                  @click="showDialog(getStatusHint.dialog)"
                >
                  <q-tooltip v-if="getStatusHint.tooltip">
                    {{ getStatusHint.tooltip }}
                  </q-tooltip>
                </q-chip>
              </template>
            </div>
          </div>
        </div>
        <q-space />
        <div class="q-py-sm row no-wrap">
          <template v-if="currentApp.action?.type">
            <div class="col-auto fit">
              <ProgressBar
                style="width: 188px"
                :title="currentApp.action.progress * 100 + '%'"
                titleSize="40px"
                :progress="currentApp.action.progress"
                :color="appsStore.progressColors(currentApp.action.type).bar"
                :track-color="
                  appsStore.progressColors(currentApp.action.type).track
                "
                size="54px"
              />
            </div>
          </template>
          <template v-else>
            <div class="col-auto" :class="{ 'q-mr-md': isInstalledOrUpdate }">
              <template
                v-if="appsStore.getButtonState(currentApp) === 'installed'"
              >
                <AppInstalledBtn size="22px" padding="15px 60px" />
              </template>
              <template
                v-else-if="appsStore.getButtonState(currentApp) === 'update'"
              >
                <AppUpdateBtn
                  :app="currentApp"
                  :loading="appsStore.loadingInstalledApps"
                  size="22px"
                  padding="15px 60px"
                />
              </template>
              <template v-else>
                <AppInstallBtn
                  :app="currentApp"
                  :loading="appsStore.loadingInstalledApps"
                  size="22px"
                  padding="15px 60px"
                />
              </template>
            </div>
            <template v-if="isInstalledOrUpdate">
              <div class="col-auto">
                <AppDeleteBtn :app="currentApp" size="16px" padding="15px" />
              </div>
            </template>
          </template>
        </div>
      </div>
      <div class="row q-mb-lg" style="height: 140px">
        <q-btn
          flat
          dense
          color="primary"
          icon="mdi-chevron-left"
          @click="animateScroll('backward')"
        />
        <q-scroll-area
          ref="scrollAreaRef"
          class="row col no-wrap no-pointer-events q-mx-sm"
          :thumb-style="{ display: 'none' }"
        >
          <div class="app__screenshot-wrapper row no-wrap">
            <template
              v-for="(screenshot, index) in currentApp.currentVersion
                .screenshots"
              :key="index"
            >
              <div class="app__image-wrapper bg-primary q-pa-xs q-mx-xs">
                <q-img
                  class="app__image"
                  :ratio="256 / 128"
                  :src="screenshot"
                  style="width: 248px"
                />
              </div>
            </template>
          </div>
        </q-scroll-area>
        <q-btn
          flat
          dense
          color="primary"
          icon="mdi-chevron-right"
          @click="animateScroll('forward')"
        />
      </div>
      <div class="q-mb-lg">
        <h5 class="text-h5 q-my-sm">Description</h5>
        <q-markdown
          no-heading-anchor-links
          no-html
          no-image
          no-link
          no-linkify
          no-typographer
          :src="currentApp.currentVersion.shortDescription"
        ></q-markdown>
        <q-markdown
          no-heading-anchor-links
          no-html
          no-image
          no-typographer
          :src="currentApp.currentVersion.description"
        ></q-markdown>
        <h5 class="text-h5 q-my-sm">Changelog</h5>
        <q-markdown
          no-heading-anchor-links
          no-html
          no-image
          no-typographer
          :src="currentApp.currentVersion.changelog"
        ></q-markdown>
        <h5 class="text-h6 q-my-sm">Developer</h5>
        <p>
          <a
            class="text-grey-7"
            :href="currentApp.currentVersion.links.manifestUri"
            target="_blank"
            style="text-decoration: none"
          >
            <q-icon name="mdi-github" color="grey-7" size="20px" />
            <span class="q-ml-xs" style="text-decoration: underline"
              >Manifest</span
            >
          </a>
          <br />
          <a
            class="text-grey-7"
            :href="currentApp.currentVersion.links.sourceCode.uri"
            target="_blank"
            style="text-decoration: none"
          >
            <q-icon name="mdi-github" color="grey-7" size="20px" />
            <span class="q-ml-xs" style="text-decoration: underline"
              >Repository</span
            >
          </a>
        </p>
      </div>
      <q-btn
        no-caps
        outline
        color="negative"
        icon="mdi-alert-circle-outline"
        label="Report app"
        @click="showReportDialog"
      />
      <AppOutdatedAppDialog
        v-model="appsStore.dialogs.outdatedAppDialog"
        :href="currentApp.currentVersion.links.manifestUri"
      />
      <q-dialog v-model="reportDialog">
        <q-card class="dialog" style="min-width: 300px">
          <q-card-section class="q-pb-none">
            <h6 class="q-ma-none">Report app</h6>
          </q-card-section>

          <q-card-section>
            <q-select
              v-model="report.description_type"
              :options="reportOptions"
              label="What do you want to submit?"
            />
          </q-card-section>

          <q-card-section v-if="report.description_type === 'bug'">
            Sorry, we don't provide support for third-party apps.<br />
            You can file an issue on Github or contact the app developer.
          </q-card-section>
          <q-card-section v-if="report.description_type === 'report'">
            <q-input
              v-model="report.description"
              placeholder="Describe your problem"
              autogrow
            />
            <p v-if="reportSubmitted" class="text-positive q-ma-none q-mt-md">
              We received your report. Thank you for the feedback!
            </p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              text-color="dark"
              class="q-mr-md"
              label="Cancel"
              v-close-popup
            ></q-btn>
            <q-btn
              v-if="
                !report.description_type || report.description_type === 'report'
              "
              outline
              color="primary"
              label="Send"
              :disabled="reportSubmitted || !report.description"
              @click="sendReport"
            ></q-btn>
            <q-btn
              v-if="report.description_type === 'bug'"
              outline
              color="primary"
              label="View on Github"
              v-close-popup
              :href="currentApp.currentVersion.links.manifestUri"
              target="_blank"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppInstallBtn } from 'features/Apps/InstallButton'
import { AppUpdateBtn } from 'features/Apps/UpdateButton'
import { AppDeleteBtn } from 'features/Apps/DeleteButton'
import { ProgressBar } from 'shared/components/ProgressBar'
import { Loading } from 'shared/components/Loading'
import {
  AppsApi,
  AppsModel,
  AppInstalledBtn,
  AppOutdatedAppDialog
} from 'entities/Apps'
const appsStore = AppsModel.useAppsStore()

import { CategoryChip, CategoryModel } from 'entities/Category'
import { bytesToSize } from 'shared/lib/utils/bytesToSize'
import { FlipperModel } from 'entities/Flipper'
import { type QScrollArea } from 'quasar'
import { FlipperWeb } from 'src/shared/lib/flipperJs'
const flipperStore = FlipperModel.useFlipperStore()

const { fetchAppById, submitAppReport } = AppsApi

const route = useRoute()
const router = useRouter()

const currentApp = ref<AppsModel.AppDetail | undefined>(undefined)
const categoriesStore = CategoryModel.useCategoriesStore()

const getCategories = async () => {
  if (
    !categoriesStore.categories.length ||
    flipperStore.api !== categoriesStore.lastApi ||
    flipperStore.target !== categoriesStore.lastTarget
  ) {
    await categoriesStore.getCategories({
      api: flipperStore.api,
      target: flipperStore.target
    })
  }
}

watch(
  () => flipperStore.flipperReady,
  async () => {
    await getCategories()
  }
)

const init = async () => {
  await getCurrentApp()
  await getCategories()
}

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      if (!flipperStore.isElectron) {
        if (flipperStore.flipper instanceof FlipperWeb) {
          await flipperStore.flipper?.startRPCSession()
        }
      } else {
        flipperStore.flipper?.setReadingMode('rpc')
      }
    }

    if (flipperStore.flipper?.readingMode.type === 'rpc') {
      if (!flipperStore.info) {
        await flipperStore.flipper?.getInfo()
      }

      await init()

      if (!appsStore.flipperInstalledApps?.length) {
        await appsStore.getInstalledApps({
          refreshInstalledApps: true
        })
      }
    }
  } else {
    await init()
  }
})

watch(
  () => flipperStore.flags.catalogChannelProduction,
  async () => {
    await init()

    if (!flipperStore.flipper) {
      await appsStore.getInstalledApps({
        refreshInstalledApps: true
      })
    }
  }
)

const loading = ref(true)
const getCurrentApp = async () => {
  loading.value = true
  currentApp.value = await fetchAppById({
    id: route.params.path as string,
    api: flipperStore.api,
    target: flipperStore.target
  })
  loading.value = false
}

watch(
  () => flipperStore.flipperReady,
  () => {
    getCurrentApp()
  }
)

const isInstalledOrUpdate = computed(() => {
  return (
    currentApp.value &&
    (appsStore.getButtonState(currentApp.value) === 'installed' ||
      appsStore.getButtonState(currentApp.value) === 'update')
  )
})

type StatusHint = {
  text: string
  icon: string
  color: string
  tooltip?: string
  dialog?: string
}

type StatusHints = {
  [k: string]: StatusHint
}

const statusHints: StatusHints = {
  READY: {
    text: 'Runs on latest firmware release',
    icon: 'mdi-check-circle-outline',
    color: 'light-green-2'
  },
  BUILD_RUNNING: {
    text: 'App is rebuilding',
    icon: 'mdi-alert-circle-outline',
    color: 'yellow-2',
    tooltip: 'This may take some time, come back later'
  },
  FLIPPER_OUTDATED: {
    text: 'Flipper firmware is outdated',
    icon: 'mdi-alert-circle-outline',
    color: 'deep-orange-2',
    dialog: 'outdatedFirmwareDialog'
  },
  UNSUPPORTED_APPLICATION: {
    text: 'Outdated app',
    icon: 'mdi-alert-circle-outline',
    color: 'deep-orange-2',
    dialog: 'outdatedAppDialog'
  },
  UNSUPPORTED_SDK: {
    text: 'Unsupported SDK',
    icon: 'mdi-alert-circle-outline',
    color: 'deep-orange-2',
    dialog: 'outdatedFirmwareDialog'
  }
}

const getStatusHint = computed(() => {
  if (currentApp.value) {
    return statusHints[currentApp.value.currentVersion.status]
  }

  return null
})

const showDialog = (dialog: string | undefined) => {
  if (dialog) {
    appsStore.dialogs[dialog] = true
  }
}

const category = computed(() =>
  categoriesStore.categories?.find((e) => e.id === currentApp.value?.categoryId)
)
const goCategory = () => {
  if (category.value) {
    router.push({
      name: 'AppsCategory',
      params: { path: category.value.name.toLowerCase() }
    })
  } else {
    router.push({ name: 'Apps' })
  }
}

const scrollAreaRef = ref<QScrollArea>()
const screenshotWidth = 248 + 4 + 8 + 8
const position = ref(0)
const animateScroll = (direction: string) => {
  if (!scrollAreaRef.value || !currentApp.value) {
    return
  }
  const width = scrollAreaRef.value.$el.offsetWidth
  const numberOfScreenshots = currentApp.value.currentVersion.screenshots.length
  const screenshotsOnScreen = Math.floor(width / screenshotWidth) || 1

  if (numberOfScreenshots) {
    if (direction === 'forward') {
      if (
        position.value + screenshotWidth * screenshotsOnScreen <
        screenshotWidth * numberOfScreenshots
      ) {
        position.value = position.value + screenshotWidth
      }
    }

    if (direction === 'backward') {
      if (position.value < 0) {
        position.value = 0
      } else {
        position.value = position.value - screenshotWidth
      }
    }

    scrollAreaRef.value.setScrollPosition('horizontal', position.value, 300)
  }
}

const reportDialog = ref(false)
const reportSubmitted = ref(false)
const report = reactive({
  description_type: '',
  description: ''
})
const reportOptions = ['bug', 'report']
const showReportDialog = () => {
  reportDialog.value = true
}
const sendReport = async () => {
  if (currentApp.value) {
    await submitAppReport({
      id: currentApp.value.id,
      report
    })
  }
  reportSubmitted.value = true
}
</script>

<style lang="scss">
@import './styles';
</style>
