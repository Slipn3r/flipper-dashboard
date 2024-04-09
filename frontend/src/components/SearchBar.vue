<template>
  <div class="full-width relative-position justify-center">
    <q-input
      dense borderless
      v-model="text"
      class="full-width q-px-md bg-grey-3"
      style="border-radius: 20px"
      label="Search"
      debounce="400"
      :loading="flags.loading"
    >
      <template v-slot:prepend>
        <q-icon name="mdi-magnify" class="text-grey-7"/>
      </template>
    </q-input>
    <q-list
      v-if="(text.length >= 2)"
      bordered
      class="absolute bg-white rounded-borders z-top"
      style="width: 270px; top: 43px;"
    >
      <template v-if="found.length">
        <q-item
          v-for="app in found"
          :key="app"
          clickable
          dense
          v-ripple
          @click="itemClicked(app)"
        >
          <q-item-section v-if="app.currentVersion" avatar>
            <q-avatar square size="24px" style="margin: 4px">
              <img :src="app.currentVersion.iconUri" style="image-rendering: pixelated;">
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ app.currentVersion.name }}</q-item-section>
        </q-item>
      </template>
      <template v-else-if="!flags.loading">
        <q-item dense>
          <q-item-section class="text-grey-7">Nothing found</q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { fetchAppsShort } from 'util/fetch'

import { useAppsStore } from 'stores/global/apps'
const appsStore = useAppsStore()

const sdk = computed(() => appsStore.sdk)

const flags = ref({
  loading: false
})
const text = ref('')
const found = ref([])

watch(text, async (newValue) => {
  if (newValue.length < 3) {
    return
  }
  const params = {
    limit: 8,
    offset: 0,
    sort_by: 'updated_at',
    sort_order: -1,
    is_latest_release_version: true,
    query: newValue
  }

  if (sdk.value.target || sdk.value.api) {
    delete params.is_latest_release_version
    if (sdk.value.target) {
      params.target = sdk.value.target
    }
    if (sdk.value.api) {
      params.api = sdk.value.api
    }
  }

  flags.value.loading = true
  await fetchAppsShort(params)
    .then(apps => {
      found.value = apps
    })
    .catch(error => {
      console.error(error)
      found.value = []
    })
  flags.value.loading = false
})

const itemClicked = (app) => {
  appsStore.openApp(app)
  text.value = ''
}
</script>

<style lang="sass" scoped>
input
  color: black !important
</style>
