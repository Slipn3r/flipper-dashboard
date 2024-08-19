<template>
  <q-card class="installed-card row no-wrap items-center" flat>
    <q-card-section class="row col items-center">
      <div class="installed-card__icon-wrapper q-mr-md">
        <q-img
          :src="`data:image/png;base64,${app.icon}`"
          style="image-rendering: pixelated"
        />
      </div>
      <div class="col column q-mr-md">
        <div class="row">
          <p class="text-h6 q-mr-sm q-mb-none">{{ app.name }}</p>
          <q-chip
            v-if="unsupported"
            class="q-px-sm"
            color="deep-orange-2"
            icon="mdi-alert-circle-outline"
            label="Outdated app"
            size="12px"
            dense
          />
        </div>
        <div class="text-grey-7">
          {{ app.installedVersion.shortDescription }}
        </div>
      </div>
      <q-space />
      <div v-if="app.installedVersion.version" class="column items-end">
        <p class="text-grey-7 q-mb-none">Version:</p>
        <b>{{ app.installedVersion.version }}</b>
      </div>
    </q-card-section>
    <q-card-section class="row no-wrap">
      <template v-if="app.action?.type">
        <ProgressBar
          style="width: 120px"
          :title="app.action.progress * 100 + '%'"
          :progress="app.action.progress"
          :color="appsStore.progressColors(app.action.type).bar"
          :trackColor="appsStore.progressColors(app.action.type).track"
        />
      </template>
      <template v-else>
        <div class="installed-card__button-wrapper q-mr-sm">
          <slot name="button" />
        </div>
        <div class="col-auto">
          <AppDeleteBtn :app="app" />
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { AppDeleteBtn } from 'features/Apps/DeleteButton'
import { ProgressBar } from 'shared/components/ProgressBar'
import { AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppsStore()

interface Props {
  app: AppsModel.InstalledApp
  unsupported?: boolean
}

withDefaults(defineProps<Props>(), {
  unsupported: false
})
</script>

<style scoped lang="scss">
@import 'styles';
</style>
