<template>
  <q-page>
    <div
      class="row q-mb-lg"
      :class="`${$q.screen.width > 670 ? 'no-wrap' : 'justify-center'}`"
    >
      <q-list class="row q-col-gutter-md" :class="$q.screen.width > 670 ? 'col-8 items-center' : 'justify-center q-mb-lg'">
        <div
          v-for="category in catalogCategories"
          :key="category.name"
          class="col-auto"
        >
          <q-chip
            class="q-ma-none"
            :style="`background-color: #${category.color}; opacity: ${currentCategory && currentCategory.name !== category.name ? '0.5' : '1'}`"
            clickable
            @click="onSelectCategory(category)"
          >
            <q-icon v-if="category.iconUri" :name="`img:${category.iconUri}`" size="14px" class="q-my-xs q-mr-sm"/>
            <span class="text-no-wrap">{{ category.name }}</span>
          </q-chip>
        </div>
      </q-list>
      <q-space v-if="$q.screen.width > 670"/>
      <div>
        <div class="row no-wrap justify-end text-grey-7">
          <q-select
            v-model="appsMainStore.sortModel"
            @update:model-value="onSortApps()"
            :options="sortOptions"
            dense
            standout="bg-primary text-white no-shadow"
            rounded
            style="min-width: fit-content; border-radius: 20px;"
          />
        </div>
      </div>
    </div>

    <q-infinite-scroll
      ref="infinityScrollRef"
      v-if="!flags.loadingCategories"
      @load="onLoad"
      :offset="500"
      class="full-width q-mt-sm"
    >
      <div class="apps">
        <q-intersection
          v-for="app in apps"
          :key="app.name"
          once
          transition="scale"
          class="flex justify-center q-pa-none card-container"
          style="width: fit-content"
        >
          <div
            style="width: calc(256px + 4px + 8px)"
            class="app-card"
            @click="appClicked(app)"
          >
            <div
              class="rounded-borders q-pa-xs q-mb-sm bg-primary"
              style="border-radius: 6px; border: 2px solid black;"
            >
              <q-img
                :src="app.currentVersion.screenshots[0]"
                :ratio="256/128"
                style="image-rendering: pixelated"
              />
            </div>

            <div class="flex justify-between no-wrap" style="padding: 0 4px">
              <div class="text-h6 ellipsis" style="flex-grow: 1;flex-basis: 179px;margin-right: 3px;">{{ app.currentVersion.name }}</div>
              <div style="font-size: 18px; line-height: 18px;">
                <span>
                  <q-icon :name="`img:${categories.find(e => e.id === app.categoryId).iconUri}`" size="14px" class="q-mr-sm"/>
                  <span style="font-size: 13px">{{ categories.find(e => e.id === app.categoryId).name }}</span>
                </span>
              </div>
            </div>

            <div
              style="display: grid;grid-template-columns: 1fr auto;padding-left: 4px;align-items: end;"
              :style="`padding-right: ${app.action.type && app.action.id === app.id ? 0 : 4}px`"
            >
              <span class="col-shrink desc text-grey-7" style="margin-bottom: 2px;max-height: 30px;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
                {{ app.currentVersion.shortDescription }}
              </span>
              <div class="col-shrink" style="width: 80px;">
                <template v-if="app.action.type && app.action.id === app.id">
                  <q-linear-progress
                    :value="app.action.progress"
                    size="32px"
                    :color="appsStore.actionColors(app).bar"
                    :track-color="appsStore.actionColors(app).track"
                    style="width: 80px; border-radius: 5px;"
                  >
                    <div class="absolute-full flex flex-center" style="border: 2px solid; border-radius: 5px;">
                      <div
                        class="app-progress-label"
                        style="font-size: 28px;"
                      >{{ `${app.action.progress * 100}%` }}</div>
                    </div>
                  </q-linear-progress>
                </template>
                <q-btn
                  v-else
                  flat
                  dense
                  color="white"
                  style="margin-left: 5px; padding: 0; border-radius: 5px; font-size: 16px; line-height: 16px;"
                  :loading="mainFlags.connected && flags.loadingInstalledApps"
                  :disable="app.actionButton?.disabled || false"
                  :label="app.actionButton?.text"
                  class="fit no-shadow text-pixelated"
                  :class="mainFlags.connected && flags.loadingInstalledApps ? 'bg-primary' : app.actionButton?.class"
                  @click.stop="appsStore.onAction(app, app.actionButton?.text)"
                />
              </div>
            </div>
          </div>
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
    <template v-if="!apps.length && !flags.loadingInitial">
      <q-card flat>
        <q-card-section class="q-pa-none q-ma-md" align="center">
          <q-icon name="mdi-alert-circle" color="primary" size="64px" />
          <div class="text-h6 q-my-sm">Not Compatible with your Firmware</div>
          <p>To access this category, install the latest firmware version from <span class="text-positive">Release</span> Channel on your Flipper</p>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Loading from 'src/components/Loading.vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)

import { useAppsStore } from 'stores/global/apps'
const appsStore = useAppsStore()

import { useAppsMainStore } from './stores'
const appsMainStore = useAppsMainStore()

const flags = computed(() => appsMainStore.flags)
const apps = computed(() => appsMainStore.apps)
const categories = computed(() => appsMainStore.categories)
const initialCategory = computed(() => appsMainStore.initialCategory)

const infinityScrollRef = ref(null)

const catalogCategories = computed(() => appsMainStore.catalogCategories)
const currentCategory = computed(() => appsMainStore.currentCategory)
const sortOptions = computed(() => appsMainStore.sortOptions)
const onSortApps = () => {
  appsMainStore.onSortApps({
    infinityScrollRef
  })
}

const appClicked = appsMainStore.appClicked
const onSelectCategory = (category) => {
  appsMainStore.onSelectCategory({
    category,
    infinityScrollRef
  })
}
const onLoad = appsMainStore.onLoad

watch(() => initialCategory, (newCategory) => {
  appsMainStore.setCurrentCategory(newCategory)
})

watch(() => mainFlags.value.connected, (condition) => {
  appsStore.toggleFlag('fetchEnd', false)

  if (!condition) {
    appsStore.updateInstalledApps()
  }
})

onMounted(async () => {
  await appsStore.getCategories()

  appsMainStore.setCurrentCategory(appsStore.initialCategory)
})
</script>

<style lang="sass" scoped>
.apps
  display: grid
  grid-template-columns: repeat(4, 1fr)
  justify-items: center

  .card-container
    padding: 12px
    border-radius: 14px
    transition-duration: 300ms
    cursor: pointer
    &:hover
      box-shadow: 0 1px 11px rgb(0 0 0 / 13%), 0 3px 6px rgb(0 0 0 / 5%), 0 3px 6px -2px rgb(0 0 0 / 8%)
  .app-card
    display: flex
    flex-direction: column
    justify-content: center
    padding: 0
    border-radius: 3px
    .text-h6
      line-height: 1.75rem
    .desc
      font-size: 12px
      line-height: 15px

@media (max-width: 1340px)
  .apps
    grid-template-columns: repeat(3, 1fr)

@media (max-width: 1032px)
  .apps
    grid-template-columns: repeat(2, 1fr)

@media (max-width: 875px)
  .categories
    grid-template-columns: repeat(4, 1fr)

@media (max-width: 670px)
  .categories
    grid-template-columns: repeat(3, 1fr)
  .apps
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    align-items: center

@media (max-width: 545px)
  .categories
    grid-template-columns: repeat(2, 1fr)
</style>
