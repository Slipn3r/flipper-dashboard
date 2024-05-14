<template>
  <q-layout
    view="hhh LpR lFf"
    class="column items-center q-py-lg full-width"
    :style="$q.screen.width >= 404 ? 'padding: 24px 26px; max-width: 1284px' : 'padding: 24px 6px'"
  >
    <q-page-container
      class="full-width"
    >
      <q-header class="bg-transparent text-black" style="padding: 24px 26px;">
        <q-toolbar
          class="apps-navbar row justify-end items-center full-width"
        >
          <q-icon
            v-if="currentApp || flags.installedPage"
            name="mdi-chevron-left"
            size="56px"
            class="cursor-pointer q-mr-md"
            @click="appsStore.toggleFlag('installedPage', false); !appsStore.initialCategory ? router.push({ name: 'Apps' }) : router.push({ name: 'AppsCategory', params: { path: appsStore.initialCategory.name.toLowerCase() } })"
          ></q-icon>
          <q-icon
            v-else
            name="svguse:common-icons.svg#apps"
            size="56px"
            class="q-mr-md"
          ></q-icon>
          <div class="text-h4 q-mr-lg">Apps</div>
          <q-space />
          <div
            class="col-grow"
            :style="$q.screen.width <= 353 ? 'margin-top: 16px; width: 100%' : 'max-width: 300px; min-width: 140px; width: 100%; margin: 0.6rem 0;'"
          >
            <SearchBar/>
          </div>
          <div class="q-ml-md" :style="$q.screen.width <= 365 ? 'margin-top: 16px' : ''">
            <div>
              <q-btn
                flat
                rounded
                no-caps
                :color="flags.installedPage ? 'primary' : 'black'"
                style="font-weight: 400"
                icon="svguse:common-icons.svg#installed"
                :stack="$q.screen.width <= 365"
                @click="toggleInstalled"
                label="Installed"
              >
                <q-badge
                  v-if="$q.screen.width > 365 && flags.updatabledAppsCount > 0"
                  color="positive"
                  floating
                  class="outdated-badge"
                  :label="flags.updatabledAppsCount"
                />
              </q-btn>
            </div>
            <div class="q-ml-md">
              <q-btn
                flat
                rounded
                no-caps
                color="black"
                style="font-weight: 400"
                icon="mdi-github"
                label="Contribute"
                :stack="$q.screen.width <= 365"
                href="https://github.com/flipperdevices/flipper-application-catalog"
                target="_blank"
              />
            </div>
          </div>
        </q-toolbar>
      </q-header>
      <router-view
        @showDialog="$event => appsStore.toggleFlag($event, true)"
      />
      <q-dialog v-model="flags.outdatedFirmwareDialogPersistent" persistent>
        <q-card class="dialog">
          <!--<q-btn icon="close" flat round dense v-close-popup class="dialog-close-btn"/>-->

          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="negative" size="64px" />
            <div class="text-h6 q-my-sm">Outdated Firmware Version</div>
            <p>Firmware version on your Flipper is not supported.<br />Click the button below to update your device.</p>
          </q-card-section>

          <q-card-section class="q-pt-none" align="center">
            <q-btn
              outline
              color="primary"
              label="Update"
              @click="$router.push('/')"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.outdatedFirmwareDialog">
        <q-card class="dialog">
          <q-btn icon="close" flat round dense v-close-popup class="dialog-close-btn"/>

          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="negative" size="64px" />
            <div class="text-h6 q-my-sm">Outdated Firmware Version</div>
            <p>Firmware version on your Flipper does not support this app.<br />Click the button below to update your device.</p>
          </q-card-section>

          <q-card-section class="q-pt-none" align="center">
            <q-btn
              outline
              color="primary"
              label="Update"
              @click="$router.push('/')"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.outdatedAppDialog">
        <q-card class="dialog">
          <q-btn icon="close" flat round dense v-close-popup class="dialog-close-btn"/>

          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="negative" size="64px" />
            <div class="text-h6 q-my-sm">Outdated app</div>
            <p>Contact the developer to request further app support.</p>
          </q-card-section>

          <q-card-section class="q-pt-none" align="center">
            <q-btn
              outline
              color="primary"
              label="View on GitHub"
              :href="currentApp.currentVersion.links.manifestUri"
              target="_blank"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.connectFlipperDialog">
        <q-card class="dialog">
          <q-btn icon="close" flat round dense v-close-popup class="dialog-close-btn"/>

          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="primary" size="64px" />
            <div class="text-h6 q-my-sm">Flipper disconnected</div>
            <p>Plug in your Flipper and click the button below.</p>
          </q-card-section>

          <q-card-section class="q-pt-none" align="center">
            <q-btn
              outline
              color="primary"
              label="Connect"
              @click="mainStore.start()"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.mobileAppDialog">
        <q-card class="dialog">
          <q-btn icon="close" flat round dense v-close-popup class="dialog-close-btn"/>

          <q-card-section class="q-pa-none q-ma-md" align="center">
            <q-icon name="mdi-alert-circle" color="primary" size="64px" />
            <div class="text-h6 q-my-sm">Apps don't work in mobile browsers</div>
            <p>Mobile browsers can't connect to Flipper, meaning you won't be able to install apps.</p>
            <p>Get the official mobile app – it has the same features!</p>
          </q-card-section>

          <q-card-section class="q-pt-none" align="center">
            <q-btn
              outline
              color="primary"
              label="Download app"
              href="https://flpr.app"
              target="_blank"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import SearchBar from 'components/SearchBar.vue'
import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)
const flipper = computed(() => mainStore.flipper)
const info = computed(() => mainStore.info)

import { useAppsStore } from 'stores/global/apps'
const appsStore = useAppsStore()

const flags = computed(() => appsStore.flags)
const flipperReady = computed(() => appsStore.flipperReady)
const currentApp = computed(() => appsStore.currentApp)
const categories = computed(() => appsStore.categories)

const router = useRouter()
const route = useRoute()

const $q = useQuasar()
const componentName = 'Apps'

onMounted(() => {
  start()
})

const startRpc = async () => {
  appsStore.toggleFlag('rpcToggling', true)

  await flipper.value.startRPCSession()
    .catch(error => {
      console.error(error)
      log({
        level: 'error',
        message: `${componentName}: Error while starting RPC: ${error.toString()}`
      })
    })
  appsStore.toggleFlag('rpcActive', true)
  mainStore.setRpcStatus(true)

  appsStore.toggleFlag('rpcToggling', false)

  log({
    level: 'info',
    message: `${componentName}: RPC started`
  })
}

const toggleInstalled = () => {
  if (!mainFlags.value.connected) {
    appsStore.toggleFlag('connectFlipperDialog', true)
    return
  }

  router.push({ name: 'InstalledApps' })
}

const ensureCommonPaths = async () => {
  if (flipperReady.value) {
    let dir = await flipper.value.RPC('storageStat', { path: '/ext/apps_manifests' })
      .catch(error => rpcErrorHandler(componentName, error, 'storageStat'))
    if (!dir) {
      await flipper.value.RPC('storageMkdir', { path: '/ext/apps_manifests' })
        .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
    }

    dir = await flipper.value.RPC('storageStat', { path: '/ext/.tmp' })
      .catch(error => rpcErrorHandler(componentName, error, 'storageStat'))
    if (!dir) {
      await flipper.value.RPC('storageMkdir', { path: '/ext/.tmp' })
        .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
    }

    dir = await flipper.value.RPC('storageStat', { path: '/ext/.tmp/lab' })
      .catch(error => rpcErrorHandler(componentName, error, 'storageStat'))
    if (!dir) {
      await flipper.value.RPC('storageMkdir', { path: '/ext/.tmp/lab' })
        .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
    }
  }
}

const watchParams = async () => {
  const path = route.params.path

  if (route.name === 'InstalledApps') {
    appsStore.toggleFlag('installedPage', true)
    return
  } else {
    appsStore.toggleFlag('installedPage', false)
  }
  if (!path) {
    return
  }

  const normalize = (string) => string.toLowerCase().replaceAll(' ', '-')
  const category = categories.value.find(e => normalize(e.name) === normalize(path))
  if (category) {
    appsStore.setInitalCategory(category)
  }
}

const start = async () => {
  appsStore.toggleFlag('rpcActive', mainFlags.value.rpcActive)

  if (mainFlags.value.connected) {
    if (!flags.value.rpcActive) {
      // if flipper is connected without active RPC session (e.g. came from CLI app)
      await startRpc()
      return
    }
    if (flipperReady.value) {
      // when RPC session is up and device info retreived, get firmware API version and device target
      try {
        const api = `${info.value.firmware.api.major}.${info.value.firmware.api.minor}`
        const target = `f${info.value.firmware.target}`

        appsStore.setPropertySdk({ api })
        appsStore.setPropertySdk({ target })
      } catch (error) {
        appsStore.toggleFlag('outdatedFirmwareDialogPersistent', true)
      }

      await ensureCommonPaths()
      await appsStore.getInstalledApps()
    } else {
      return
    }
  } else {
    appsStore.setInstalledApps([])
    // mainStore.start()
  }

  await watchParams()
}

watch(flipperReady, (condition) => {
  appsStore.toggleFlag('connectFlipperDialog', false)
  if (condition) {
    start()
  }

  if (!condition) {
    appsStore.setInstalledApps([])
  }
})

watch(route, async () => {
  await watchParams()
})

watch(() => mainFlags.value.connected, (condition) => {
  if (condition) {
    appsStore.toggleFlag('loadingInstalledApps', true)
  }

  if (!condition) {
    appsStore.onClearInstalledAppsList()
  }
})
</script>

<style lang="sass" scoped>
.apps-navbar
  div
    display: flex
    align-items: center
    height: 40px

.outdated-badge
  min-width: 17px
  width: fit-content
  height: 17px !important
  position: absolute
  top: -3px
  left: 32px
  font-size: 10px
  border: 1px #ffffff solid
  border-radius: 17px
  padding: 5px
</style>
