<template>
  <div>
    <template v-if="appsStore.installationBatch.inProcess">
      <ProgressBar
        :title="`${appsStore.installationBatch.doneCount} / ${appsStore.installationBatch.totalCount}`"
        :progress="
          appsStore.installationBatch.doneCount /
          appsStore.installationBatch.totalCount
        "
        :color="appsStore.progressColors('install').bar"
        :trackColor="appsStore.progressColors('install').track"
        size="33px"
      />
    </template>
    <template v-else>
      <q-btn
        class="text-pixelated fit text-body1"
        unelevated
        dense
        color="primary"
        label="Install All"
        @click.stop="onClick"
        :loading="loading"
        :disabled="disabled"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { ProgressBar } from 'shared/components/ProgressBar'

import { FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { AppsModel, AppsApi } from 'entity/Apps'
const appsStore = AppsModel.useAppsStore()
const { fetchAppsShort } = AppsApi

interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false
})

const loading = ref(false)

const fetchEnd = ref(true)
const apps = ref<AppsModel.App[]>([])
const limit = ref(48)
const offset = ref(0)
const fetch = async () => {
  return await fetchAppsShort({
    limit: limit.value,
    offset: offset.value,
    api: flipperStore.api || undefined,
    target: flipperStore.target || undefined
  }).then(async (newApps: AppsModel.App[]) => {
    if (!newApps) {
      fetchEnd.value = true
      return
    }

    if (!newApps.length) {
      fetchEnd.value = true
    }

    if (newApps.length < limit.value) {
      fetchEnd.value = true
    }

    newApps = newApps.filter((app) => {
      if (appsStore.getButtonState(app) === 'installed') {
        return false
      }

      return true
    })

    if (newApps.length) {
      apps.value.push(...newApps)
    }

    offset.value += limit.value
  })
}

const onClick = async () => {
  fetchEnd.value = false
  offset.value = 0
  apps.value = []

  loading.value = true

  while (!fetchEnd.value) {
    await fetch()
  }

  loading.value = false

  if (apps.value.length) {
    appsStore.installationBatch.inProcess = true
    appsStore.installationBatch.totalCount = apps.value.length
    appsStore.installationBatch.doneCount = 0

    for (let index = 0; index < apps.value.length; index++) {
      const app = apps.value[index]!

      try {
        if (appsStore.getButtonState(app) === 'install') {
          appsStore.onAction(app, 'install')
        }
        if (appsStore.getButtonState(app) === 'update') {
          appsStore.onAction(app, 'update')
        }
      } catch (error) {
        console.error(error)
        appsStore.installationBatch.failed.push({
          id: app.id,
          name: app.currentVersion.name
        })
      }
    }
  }
}
</script>
