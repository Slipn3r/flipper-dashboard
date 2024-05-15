<template>
  <q-card :flat="flat" :class="{ 'dialog': isDialog }">
    <template v-if="isDialog">
      <q-btn icon="close" flat round dense v-close-popup class="dialog-close-btn"/>
    </template>

    <q-card-section class="q-pa-none q-ma-md" align="center">
      <q-icon name="mdi-alert-circle" color="primary" size="64px" />
      <div class="text-h6 q-my-sm">MicroSD card not detected</div>
      <p>{{ `It seems that the MicroSD card is not mounted or damaged. Insert the microSD card into the slot and ${mainFlags.isElectron ? 'click the «Find MicroSD» button below' : 'try again.'}` }}</p>
      <template v-if="mainFlags.isElectron">
        <q-btn
          unelevated
          color="primary"
          icon="mdi-magnify"
          label="Find MicroSD"
          no-caps
          @click="onFindMicroSD"
        />
      </template>
    </q-card-section>

    <q-card-section class="q-pt-none" align="center">
      <q-btn
        outline
        color="primary"
        label="Instruction manual"
        href="https://docs.flipper.net/basics/sd-card#Hjdbt"
        target="_blank"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from 'stores/global/main'
import showNotif from 'src/composables/useShowNotif'

const mainStore = useMainStore()
const mainFlags = computed(() => mainStore.flags)

defineProps({
  flat: {
    type: Boolean,
    default: false
  },
  isDialog: {
    type: Boolean,
    default: false
  }
})

const onFindMicroSD = async () => {
  await mainStore.readInfo()

  if (mainStore.info?.storage.sdcard.status.isInstalled) {
    mainStore.toggleFlag('microSDcardMissingDialog', false)
  } else {
    showNotif({
      message: 'MicroSD not found',
      color: 'warning',
      textColor: 'black',
      timeout: 1000
    })
  }
}
</script>
