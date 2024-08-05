<template>
  <q-header class="bg-transparent text-black q-pa-lg">
    <q-toolbar class="row justify-end items-center q-pa-none">
      <div>
        <q-btn
          v-if="showBackButton"
          class="q-mr-md"
          flat
          round
          dense
          @click="goCatalog"
        >
          <q-icon name="mdi-chevron-left" size="56px" />
        </q-btn>
        <q-icon v-else class="q-mr-md" name="flipper:apps" size="56px" />
      </div>
      <h4 class="q-ma-none text-h4">Apps</h4>
      <q-space />
      <q-input
        class="q-mr-md text-black"
        style="width: 300px"
        v-model.trim="search"
        input-class="text-black"
        bg-color="grey-3"
        rounded
        dense
        standout="no-shadow text-black"
        type="text"
        label="Search"
        debounce="400"
      >
        <template v-slot:prepend>
          <q-icon name="mdi-magnify" class="text-grey-7" />
        </template>
      </q-input>
      <q-btn
        class="q-mr-xs text-weight-regular"
        flat
        rounded
        no-caps
        color="black"
        icon="flipper:installed"
        label="Installed"
        :to="{ name: 'InstalledApps' }"
      >
        <q-badge
          v-if="$q.screen.width > 365 && appsStore.appsUpdateCount > 0"
          color="positive"
          floating
          class="outdated-badge"
          :label="appsStore.appsUpdateCount"
        />
      </q-btn>
      <q-btn
        class="text-weight-regular"
        flat
        rounded
        no-caps
        color="black"
        icon="mdi-github"
        label="Contribute"
        href="https://github.com/flipperdevices/flipper-application-catalog"
        target="_blank"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppsModel } from 'entities/Apps'
const appsStore = AppsModel.useAppStore()

const search = ref('')
const route = useRoute()
const router = useRouter()

const showBackButton = computed(
  () => route.name === 'AppsPath' || route.name === 'InstalledApps'
)

const goCatalog = () => {
  router.push({ name: 'Apps' })
}
</script>
