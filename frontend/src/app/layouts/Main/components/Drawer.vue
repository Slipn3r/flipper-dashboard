<template>
  <q-drawer
    class="menu-link bg-grey-2"
    show-if-above
    :width="175"
    :breakpoint="900"
  >
    <q-scroll-area class="fit">
      <q-tab-panels v-model="tab" class="fit bg-transparent" animated>
        <q-tab-panel class="no-padding" name="home">
          <q-list class="column fit justify-between no-wrap">
            <div>
              <RouterLink
                v-for="link in linksList"
                :key="link.title"
                :disable="flipperStore.flags.disableNavigation"
                v-bind="link"
              />
            </div>
            <q-space />
            <q-item clickable @click="showSettingsMenu">
              <q-item-section avatar>
                <q-icon name="flipper:settings" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator class="menu-link__separator" />
            <template v-if="!flipperStore.isElectron">
              <FlipperConnectWebBtn type="item" />
            </template>
            <template v-else>
              <FlipperSwitch />
            </template>
          </q-list>
        </q-tab-panel>
        <q-tab-panel class="no-padding" name="settings">
          <q-list class="column fit justify-between no-wrap">
            <q-space />
            <q-item>
              <q-toggle
                v-model="flipperStore.flags.autoReconnect"
                dense
                label="Auto reconnect"
                @click="toggleAutoReconnect"
              />
            </q-item>
            <q-item v-if="appsStore.flags.catalogCanSwitchChannel">
              <q-toggle
                v-model="appsStore.flags.catalogChannelProduction"
                dense
                label="Production Apps"
                @click="toggleCatalogChannel"
              />
            </q-item>
            <q-item v-if="appsStore.flags.catalogCanInstallAllApps">
              <q-toggle
                v-model="appsStore.flags.catalogInstallAllApps"
                dense
                label="Install All Apps"
              />
            </q-item>
            <q-item clickable @click="showLogsDialog">
              <q-item-section avatar style="min-width: initial">
                <q-icon name="flipper:logs" />
              </q-item-section>

              <q-item-section>
                <q-item-label>View logs</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="showHomeMenu">
              <q-item-section avatar>
                <q-icon size="2rem" name="mdi-chevron-left" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Back</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'shared/components/RouterLink'
import { FlipperConnectWebBtn } from 'features/Flipper'
import { FlipperSwitch } from 'features/Flipper'

import { PRODUCTION_NAME, DEVELOP_NAME } from 'shared/config'

import { FlipperModel } from 'entities/Flipper'
import { instance, getBaseUrl } from 'boot/axios'
const flipperStore = FlipperModel.useFlipperStore()

import { AppsModel } from 'src/entities/Apps'
const appsStore = AppsModel.useAppsStore()

const tab = ref('home')

const showSettingsMenu = () => {
  tab.value = 'settings'
}

const showHomeMenu = () => {
  tab.value = 'home'
}

const linksList = [
  {
    title: 'My Flipper',
    icon: 'flipper:device',
    name: 'Device',
    titleOverride: computed(() => flipperStore.flipperName || 'My Flipper')
  },
  {
    title: 'Apps',
    icon: 'flipper:apps',
    name: 'Apps'
  },
  {
    title: 'Files',
    icon: 'flipper:files',
    name: 'Archive'
  },
  {
    title: 'CLI',
    icon: 'flipper:cli',
    name: 'Cli'
  },
  {
    title: 'NFC tools',
    icon: 'flipper:nfctools',
    name: 'NfcTools'
  },
  {
    title: 'Paint',
    icon: 'flipper:paint',
    name: 'Paint'
  },
  {
    title: 'Pulse Plotter',
    icon: 'flipper:subtools',
    name: 'PulsePlotter'
  }
]

const toggleAutoReconnect = () => {
  localStorage.setItem(
    'autoReconnect',
    String(flipperStore.flags.autoReconnect)
  )
}

const toggleCatalogChannel = () => {
  const catalogChannel = appsStore.flags.catalogChannelProduction
    ? PRODUCTION_NAME
    : DEVELOP_NAME

  instance.defaults.baseURL = getBaseUrl(catalogChannel)
}

const showLogsDialog = () => {
  flipperStore.dialogs.logs = true
}
</script>

<style lang="scss" scoped>
:deep(.menu-link .q-scrollarea__content) {
  height: 100%;
}

.menu-link {
  &__separator {
    width: 85%;
    margin: auto;
  }
}
</style>
