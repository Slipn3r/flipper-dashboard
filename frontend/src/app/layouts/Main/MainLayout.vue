<template>
  <q-layout view="hhh LpR fff">
    <AppHeader
      v-if="!flipperStore.isElectron"
      @toggleLeftDrawer="toggleLeftDrawer"
    />

    <AppDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <template
        v-if="
          route.meta.canLoadWithoutFlipper ||
          flipperStore.flipperReady ||
          flipperStore.flags.switchFlipper ||
          flipperStore.flags.updateInProgress
        "
      >
        <template v-if="flipperStore.flags.switchFlipper">
          <q-page class="flex flex-center" padding>
            <Loading label="Switching Flipper..." />
          </q-page>
        </template>
        <template v-else-if="flipperStore.loadingInfo">
          <q-page class="flex flex-center" padding>
            <Loading label="Loading info..." />
          </q-page>
        </template>
        <template v-else>
          <router-view />
        </template>
      </template>
      <template v-else-if="flipperStore.isElectron">
        <q-page class="flex flex-center fit" padding>
          <q-card flat>
            <q-card-section class="q-pa-none q-ma-md" align="center">
              <template
                v-if="
                  flipperStore.flags.isBridgeReady &&
                  !flipperStore.flags.flipperIsInitialized
                "
              >
                <q-img
                  src="~assets/flipper_alert.svg"
                  width="70px"
                  no-spinner
                />
                <div class="text-h6 q-my-sm">Flipper not connected</div>
              </template>
              <template v-else>
                <Loading label="Flipper is initialized..." />
              </template>
            </q-card-section>
          </q-card>
        </q-page>
      </template>
      <template v-else>
        <q-page class="flex flex-center fit" padding>
          <FlipperConnectWebBtn />
        </q-page>
      </template>

      <q-dialog v-model="flipperStore.dialogs.microSDcardMissing">
        <FlipperMicroSDCard
          isDialog
          :showFindMicroSdBtn="flipperStore.isElectron"
          @onFindMicroSd="flipperStore.findMicroSd"
        />
      </q-dialog>
      <AppOutdatedFirmwareDialog
        v-model="appsStore.dialogs.outdatedFirmwareDialog"
        :persistent="appsStore.dialogs.outdatedFirmwareDialogPersistent"
      />
      <FlipperConnectFlipperDialog
        v-model="flipperStore.dialogs.connectFlipper"
      >
        <template v-slot:description>
          <template v-if="flipperStore.isElectron">
            <p>Plug in your Flipper and and wait for initialization</p>
          </template>
          <template v-else>
            <p>Plug in your Flipper and click the button below</p>
          </template>
        </template>
        <template v-slot:default>
          <template v-if="!flipperStore.isElectron">
            <FlipperConnectWebBtn />
          </template>
        </template>
      </FlipperConnectFlipperDialog>
      <FlipperMobileDetectedDialog
        v-model="flipperStore.dialogs.mobileDetected"
      />
      <FlipperUnsupportedBrowserDialog
        v-model="flipperStore.dialogs.serialUnsupported"
      />
      <q-dialog v-model="flipperStore.dialogs.logs">
        <FlipperLogCard isDialog />
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

import { AppHeader, AppDrawer } from './components'
import { Loading } from 'shared/components/Loading'

import {
  FlipperMicroSDCard,
  FlipperConnectFlipperDialog,
  FlipperMobileDetectedDialog,
  FlipperUnsupportedBrowserDialog
} from 'entity/Flipper'
import { AppsModel, AppOutdatedFirmwareDialog } from 'entity/Apps'
const appsStore = AppsModel.useAppsStore()

import { FlipperConnectWebBtn, FlipperLogCard } from 'features/Flipper'
import { FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(async () => {
  if (localStorage.getItem('autoReconnect') !== 'false') {
    flipperStore.flags.autoReconnect = true
  } else {
    flipperStore.flags.autoReconnect = false
  }
})
</script>
