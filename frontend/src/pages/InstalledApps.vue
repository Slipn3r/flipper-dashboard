<template>
  <q-page class="column full-width">
    <template v-if="loadingInstalledApps">
      <Loading
        label="Loading installed app..."
      />
    </template>
    <template v-else-if="!mainFlags.connected">
      <q-card flat>
        <q-card-section class="q-pa-none q-ma-md" align="center">
          <q-icon name="mdi-alert-circle" color="primary" size="64px" />
          <div class="text-h6 q-my-sm">Flipper disconnected</div>
          <p>Plug in your Flipper and click the button below.</p>
        </q-card-section>
      </q-card>
    </template>
    <template v-else-if="!info?.storage.sdcard.status.isInstalled">
      <div class="column items-center">
        <q-card flat>
          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="primary" size="64px" />
            <div class="text-h6 q-my-sm">MicroSD card not detected</div>
            <p>It seems that the MicroSD card is not mounted or damaged. Insert the microSD card into the slot and try again.</p>
          </q-card-section>

          <q-card-section class="q-pt-none" align="center">
            <q-btn
              outline
              color="primary"
              label="Instruction manual"
              href="https://docs.flipper.net/basics/sd-card#Hjdbt"
              target="_blank"
            />
          </q-card-section>
        </q-card>
      </div>
    </template>
    <template v-else-if="appsStore.flags.noApplicationsInstalled">
      <div class="column items-center">
        <q-card flat>
          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="primary" size="64px" />
            <div class="text-h6 q-my-sm">You haven't installed any apps yet</div>
          </q-card-section>
        </q-card>
      </div>
    </template>
    <template v-else>
      <div v-if="updatableApps.length" style="width: 140px">
        <template v-if="batch.totalCount">
          <q-linear-progress
            :value="batch.doneCount / batch.totalCount + batch.action.progress / batch.totalCount"
            size="32px"
            :color="appsStore.actionColors(batch).bar"
            :track-color="appsStore.actionColors(batch).track"
            style="border-radius: 5px;"
          >
            <div class="absolute-full flex flex-center" style="border: 2px solid; border-radius: 5px;">
              <div
                class="app-progress-label"
                style="font-size: 28px;"
              >{{ `${batch.doneCount} / ${batch.totalCount}` }}</div>
            </div>
          </q-linear-progress>
        </template>
        <q-btn
          v-else
          flat
          dense
          color="white"
          style="margin-left: 5px; padding: 0; border-radius: 5px; font-size: 16px; line-height: 16px;"
          label="Update all"
          class="fit no-shadow text-pixelated bg-positive"
          @click="appsStore.batchUpdate(updatableApps);"
        >
          <div class="install-all-badge">{{ updatableApps.length }}</div>
        </q-btn>
      </div>

      <div v-if="batch.failed.length" class="text-negative">
        Update failed for
        <span v-for="app, index in batch.failed" :key="app.id">"{{ app.installedVersion.name }}"<span v-if="batch.failed[index + 1]">, </span></span>
      </div>

      <div class="column full-width" :class="batch.totalCount ? 'disabled' : ''">
        <q-intersection
          v-for="app in updatableApps"
          :key="app.currentVersion.name"
          once
          transition="scale"
        >
          <q-card
            flat
            class="row no-wrap items-center q-my-md"
            :class="app.action.type === 'delete' ? 'disabled' : ''"
          >
            <div class="flex no-wrap items-center cursor-pointer col-8" @click="appClicked(app)">
              <div class="app-icon q-mr-md">
                <q-img :src="app.currentVersion.iconUri" style="image-rendering: pixelated; width: 38px"/>
              </div>
              <div>
                <div class="text-h6" style="line-height: 1.5em; margin-bottom: 0.25rem;">{{ app.currentVersion.name }}</div>
                <div class="text-grey-7">{{ app.currentVersion.shortDescription }}</div>
              </div>
            </div>

            <q-space />

            <div v-if="app.installedVersion?.version" class="column items-end q-ml-md">
              <span class="text-grey-7">Version:</span>
              <b>{{ app.installedVersion.version }}</b>
            </div>
            <div class="q-ml-md" style="width: 80px;">
              <template v-if="app.action.type">
                <q-linear-progress
                  :value="app.action.progress"
                  size="32px"
                  :color="appsStore.actionColors(app).bar"
                  :track-color="appsStore.actionColors(app).track"
                  style="width: 80px; border-radius: 5px;"
                  class="q-ml-xs"
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
                label="Update"
                class="fit no-shadow text-pixelated bg-positive"
                @click="appsStore.onAction(app, 'update')"
              />
            </div>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="svguse:common-icons.svg#delete"
              class="q-ml-md"
              @click="showDeleteDialog(app)"
            />
          </q-card>
        </q-intersection>

        <q-separator v-if="updatableApps.length && upToDateApps.length" class="q-my-lg" />

        <q-intersection
          v-for="app in upToDateApps"
          :key="app.installedVersion.name"
          once
          transition="scale"
        >
          <q-card
            flat
            class="row no-wrap items-center q-my-md"
            :class="app.action.type === 'delete' ? 'disabled' : ''"
          >
            <div class="flex no-wrap items-center cursor-pointer col-8" @click="appClicked(app)">
              <div class="app-icon q-mr-md">
                <q-img :src="app.installedVersion.iconUri" style="image-rendering: pixelated; width: 38px"/>
              </div>
              <div>
                <div class="text-h6" style="line-height: 1.5em; margin-bottom: 0.25rem;">{{ app.installedVersion.name }}</div>
                <div class="text-grey-7">{{ app.installedVersion.shortDescription }}</div>
              </div>
            </div>

            <q-space />

            <div v-if="app.installedVersion?.version" class="column items-end q-ml-md">
              <span class="text-grey-7">Version:</span>
              <b>{{ app.installedVersion.version }}</b>
            </div>
            <div class="q-ml-md" style="width: 80px;">
              <template v-if="app.action.type">
                <q-linear-progress
                  :value="app.action.progress"
                  size="32px"
                  :color="appsStore.actionColors(app).bar"
                  :track-color="appsStore.actionColors(app).track"
                  style="width: 80px; border-radius: 5px;"
                  class="q-ml-xs"
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
                label="Installed"
                class="fit no-shadow text-pixelated bg-grey-6"
              />
            </div>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="svguse:common-icons.svg#delete"
              class="q-ml-md"
              @click="showDeleteDialog(app)"
            />
          </q-card>
        </q-intersection>

        <q-intersection
          v-for="app in unsupportedApps"
          :key="app.name"
          once
          transition="scale"
        >
          <q-card
            flat
            class="row no-wrap items-center q-my-md"
            :class="app.action?.type === 'delete' ? 'disabled' : ''"
          >
            <div class="flex no-wrap items-center cursor-pointer col-8" @click="$router.push(`/apps/${app.id}`)">
              <div class="app-icon q-mr-md">
                <q-img :src="`data:image/png;base64,${app.icon}`" style="image-rendering: pixelated; width: 38px"/>
              </div>
              <div>
                <div class="flex justify-start items-center">
                  <div class="text-h6 q-mr-sm" style="line-height: 1.5em; margin-bottom: 0.25rem;">{{ app.name }}</div>
                  <q-chip color="deep-orange-2" icon="mdi-alert-circle-outline" label="Outdated app" size="12px" dense class="q-px-sm"/>
                </div>
                <div class="text-grey-7">{{ app.installedVersion.shortDescription }}</div>
              </div>
            </div>

            <q-space />

            <div v-if="app.installedVersion.version" class="column items-end q-ml-md">
              <span class="text-grey-7">Version:</span>
              <b>{{ app.installedVersion.version }}</b>
            </div>
            <div class="q-ml-md" style="width: 80px;">
              <template v-if="app.action.type">
                <q-linear-progress
                  :value="app.action.progress"
                  size="32px"
                  :color="appsStore.actionColors(app).bar"
                  :track-color="appsStore.actionColors(app).track"
                  style="width: 80px; border-radius: 5px;"
                  class="q-ml-xs"
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
                label="Installed"
                class="fit no-shadow text-pixelated bg-grey-6"
              />
            </div>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="svguse:common-icons.svg#delete"
              class="q-ml-md"
              @click="showDeleteDialog(app)"
            />
          </q-card>
        </q-intersection>
      </div>

      <q-dialog v-model="flags.deleteConfirmationDialog">
        <q-card class="dialog" style="min-width: 300px;">
          <q-card-section class="q-pb-none">
            <div class="text-h6">Delete this app?</div>
          </q-card-section>

          <q-card-section class="q-pt-none q-my-md text-center">
            <div class="flex no-wrap items-center">
              <div class="app-icon q-mr-md">
                <template v-if="appToDelete.currentVersion">
                  <q-img :src="appToDelete.currentVersion.iconUri" style="image-rendering: pixelated; width: 38px"/>
                </template>
                <template v-else>
                  <q-img :src="`data:image/png;base64,${appToDelete.icon}`" style="image-rendering: pixelated; width: 38px"/>
                </template>
              </div>
              <div class="column items-start">
                <template v-if="appToDelete.currentVersion">
                  <div class="text-h6" style="line-height: 1.5em; margin-bottom: 0.25rem;">{{ appToDelete.currentVersion.name }}</div>
                  <div class="text-grey-7"><b>v{{ appToDelete.currentVersion.version }}</b></div>
                </template>
                <template v-else>
                  <div class="text-h6" style="line-height: 1.5em; margin-bottom: 0.25rem;">{{ appToDelete.name }}</div>
                  <div v-if="appToDelete.installedVersion.version" class="text-grey-7"><b>v{{ appToDelete.installedVersion.version }}</b></div>
                </template>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none" align="right">
            <q-btn
              flat
              text-color="dark"
              class="q-mr-md"
              label="Cancel"
              v-close-popup
            ></q-btn>
            <q-btn
              outline
              color="negative"
              label="Delete"
              v-close-popup
              @click="appsStore.onAction(appToDelete, 'delete')"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </q-page>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import Loading from 'src/components/Loading.vue'
// import semver from 'semver'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)
const info = computed(() => mainStore.info)

import { useAppsStore } from 'stores/global/apps'
const appsStore = useAppsStore()

const batch = computed(() => appsStore.batch)
const loadingInstalledApps = computed(() => appsStore.flags.loadingInstalledApps)
const installedApps = computed(() => appsStore.installedApps)
const categories = computed(() => appsStore.categories)

import { useInstalledAppsMainStore } from 'stores/pages/InstalledApps'
const InstalledAppsMainStore = useInstalledAppsMainStore()

const flags = computed(() => InstalledAppsMainStore.flags)
const appToDelete = computed(() => InstalledAppsMainStore.appToDelete)

const showDeleteDialog = (app) => {
  InstalledAppsMainStore.appToDelete = app
  InstalledAppsMainStore.toggleFlag('deleteConfirmationDialog', true)
}

watch(() => info.value?.storage.sdcard.status.isInstalled, () => {
  appsStore.toggleFlag('loadingInstalledApps', false)
})

onMounted(async () => {
  if (!mainFlags.value.connected) {
    appsStore.toggleFlag('loadingInstalledApps', false)
  }

  if (!categories.value.length) {
    await appsStore.getCategories()
  }
})

const updatableApps = computed(() => {
  return installedApps.value.filter(installedApp => {
    return installedApp.updatable === true
  })
})

const upToDateApps = computed(() => {
  return installedApps.value.filter(installedApp => {
    return installedApp.isInstalled === true
  })
})

const unsupportedApps = computed(() => {
  return installedApps.value.filter(installedApp => {
    return installedApp.unsupported === true
  })
})

const appClicked = (app) => {
  if (app.action.type) {
    return
  }
  appsStore.openApp(app)
}
</script>

<style lang="sass" scoped>
.app-icon
  width: 60px
  height: 60px
  padding: 10px
  border: 1px solid #dbdbdb
  border-radius: 10px

.install-all-badge
  position: relative
  top: -1px
  margin-left: 10px
  padding: 3px 4px 1px 4px
  font-size: 15px
  line-height: 13px
  background: #ffffffb3
  color: $positive
  border-radius: 3px
</style>
