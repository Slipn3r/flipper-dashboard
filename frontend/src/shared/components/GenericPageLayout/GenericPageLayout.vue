<template>
  <q-page class="column items-start" padding>
    <q-toolbar class="row justify-end items-center q-pa-none q-mb-md">
      <q-icon class="q-mr-md" :name="props.icon" size="42px" />
      <h4 class="q-ma-none text-h4">{{ props.title }}</h4>
      <q-space />
      <q-btn
        v-if="props.hasInfo"
        class="text-weight-regular"
        flat
        no-caps
        color="black"
        icon="mdi-information-outline"
        label="Learn more"
        @click="infoDialog = true"
      />
    </q-toolbar>

    <div v-if="props.description" class="q-mb-md">
      {{ props.description }}
    </div>

    <slot></slot>

    <q-dialog v-model="infoDialog">
      <q-card style="max-width: calc(100vw - 16px); width: 800px;">
        <q-card-section>
          <slot name="info"></slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string,
  icon: string,
  description?: string,
  hasInfo?: boolean
}>()

const infoDialog = ref(false);
</script>
