<template>
  <div class="app">
    <div class="row items-center q-mb-lg">
      <div class="app__icon-wrapper q-mr-md">
        <q-img
          :src="currentApp?.currentVersion.iconUri"
          style="image-rendering: pixelated"
        />
      </div>
      <div>
        <h2 class="text-h6 q-ma-none q-mb-xs">
          {{ currentApp?.currentVersion.name }}
        </h2>
        <div class="row items-center q-gutter-md">
          <div>
            <CategoryChip
              v-if="category"
              v-bind="category"
              @click="goCategory"
            />
          </div>
          <p class="q-mb-none">
            <span class="text-grey-7 q-mr-xs">Version:</span>
            <span class="text-bold">
              {{ currentApp?.currentVersion.version }}
            </span>
          </p>
          <p class="q-mb-none">
            <span class="text-grey-7 q-mr-xs">Size:</span>
            <span class="text-bold">
              {{
                bytesToSize(
                  currentApp?.currentVersion.currentBuild.metadata.length
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
      <q-space />
      <div class="q-py-sm">
        <AppInstallBtn :app="currentApp" size="22px" padding="15px 60px" />
      </div>
    </div>
    <div class="row q-mb-lg" style="height: 140px">
      <q-btn flat dense color="primary" icon="mdi-chevron-left" />
      <q-scroll-area
        class="row col no-wrap no-pointer-events q-mx-sm"
        :thumb-style="{ display: 'none' }"
      >
        <div class="app__screenshot-wrapper row no-wrap">
          <template
            v-for="(screenshot, index) in currentApp?.currentVersion
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
      <q-btn flat dense color="primary" icon="mdi-chevron-right" />
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
        :src="currentApp?.currentVersion.shortDescription"
      ></q-markdown>
      <q-markdown
        no-heading-anchor-links
        no-html
        no-image
        no-typographer
        :src="currentApp?.currentVersion.description"
      ></q-markdown>
      <h5 class="text-h5 q-my-sm">Changelog</h5>
      <q-markdown
        no-heading-anchor-links
        no-html
        no-image
        no-typographer
        :src="currentApp?.currentVersion.changelog"
      ></q-markdown>
      <h5 class="text-h6 q-my-sm">Developer</h5>
      <p>
        <a
          class="text-grey-7"
          :href="currentApp?.currentVersion.links.manifestUri"
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
          :href="currentApp?.currentVersion.links.sourceCode.uri"
          target="_blank"
          style="text-decoration: none"
        >
          <q-icon name="mdi-github" color="grey-7" size="20px" />
          <span class="q-ml-xs" style="text-decoration: underline">
            Repository
          </span>
        </a>
      </p>
    </div>
    <q-btn
      no-caps
      outline
      color="negative"
      icon="mdi-alert-circle-outline"
      label="Report app"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppInstallBtn } from 'features/Apps/InstallButton'
import { AppsApi, AppsModel } from 'entities/Apps'
import { CategoryChip, CategoryModel } from 'entities/Category'
import { bytesToSize } from 'shared/lib/utils/bytesToSize'

const { fetchAppById } = AppsApi

const route = useRoute()
const currentApp: Ref<AppsModel.AppDetail | undefined> = ref(undefined)
const categoryStore = CategoryModel.useCategoriesStore()
const categories = computed(() => categoryStore.categories)

onMounted(async () => {
  currentApp.value = await fetchAppById({
    id: route.params.path as string
  })

  if (!categories.value.length) {
    categoryStore.getCategories()
  }
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
    console.log(dialog)
  }
}

const category = computed(() =>
  categories.value?.find((e) => e.id === currentApp.value?.categoryId)
)
const goCategory = () => {
  console.log(category.value?.name)
}
</script>

<style lang="scss">
@import './styles.scss';
</style>
