<template>
  <template v-if="type === 'item'">
    <q-item
      clickable
      @click="flags.connected ? disconnect() : connect()"
    >
      <q-item-section avatar>
        <q-avatar
          size="md"
          square
        >
          <q-icon :name="flags.connected ? 'flipper:connected' : 'flipper:connect'" size="32px"/>
        </q-avatar>

      </q-item-section>

      <q-item-section>
        <q-item-label>{{ flags.connected ? 'Disconnect' : 'Connect' }}</q-item-label>
      </q-item-section>
    </q-item>
  </template>
  <template v-else>
    <q-btn
      outline
      color="black"
      icon="cable"
      label="Connect"
      @click="flags.connected ? disconnect() : connect()"
    />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FlipperModel } from 'entities/Flipper'
const store = FlipperModel.useFlipperStore()

defineProps({
  type: {
    type: String
  }
})

const flags = computed(() => store.flags)

const connect = store.connect
const disconnect = store.disconnect
</script>
