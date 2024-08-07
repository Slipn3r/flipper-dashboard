<template>
  <template v-if="type === 'item'">
    <q-item
      clickable
      @click="onClick"
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
      @click="onClick"
    />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

defineProps({
  type: {
    type: String
  }
})

const flags = computed(() => flipperStore.flags)

const onClick = () => {
  flipperStore.flags.connected ? disconnect({
    isUserAction: true
  }) : connect()
}
const connect = flipperStore.connect
const disconnect = flipperStore.disconnect
</script>
