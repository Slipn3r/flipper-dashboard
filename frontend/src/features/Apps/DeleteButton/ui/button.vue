<template>
  <q-btn
    class="button fit"
    padding="xs"
    color="negative"
    outline
    icon="flipper:delete"
    @click.stop="showDialog"
    :loading="props.loading"
  >
    <q-dialog v-model="deleteConfirmationDialog">
      <q-card class="dialog" style="min-width: 300px">
        <q-card-section class="q-pb-none">
          <h6 class="q-ma-none">Delete this app?</h6>
        </q-card-section>

        <q-card-section class="q-pt-none q-my-md text-center">
          <div class="flex no-wrap items-center">
            <div class="app-icon q-mr-md">
              <q-img
                :src="app.currentVersion.iconUri"
                width="50px"
                style="image-rendering: pixelated"
              />
            </div>
            <div class="column items-start">
              <h6
                class="q-ma-none"
                style="line-height: 1.5em; margin-bottom: 0.25rem"
              >
                {{ app.currentVersion.name }}
              </h6>
              <p class="text-grey-7 q-ma-none">
                <b>v{{ app.currentVersion.version }}</b>
              </p>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-pt-none" align="between">
          <q-btn
            class="col q-mr-md"
            flat
            text-color="dark"
            label="Cancel"
            v-close-popup
          />
          <q-btn
            class="col"
            outline
            color="negative"
            label="Delete"
            v-close-popup
            @click="onClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppsStore()

const deleteConfirmationDialog = ref(false)
const showDialog = () => {
  deleteConfirmationDialog.value = true
}

interface Props {
  app: AppsModel.InstalledApp | AppsModel.App
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const onClick = () => {
  if (props.app) {
    appsStore.onAction(props.app, 'delete')
  }
}
</script>
