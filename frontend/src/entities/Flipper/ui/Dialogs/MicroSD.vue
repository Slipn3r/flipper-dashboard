<template>
  <q-card class="rounded-borders" :flat="flat" :class="{ dialog: isDialog }">
    <template v-if="isDialog">
      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
        class="dialog-close-btn"
      />
    </template>

    <q-card-section class="q-pa-none q-ma-md" align="center">
      <q-icon name="mdi-alert-circle" color="primary" size="64px" />
      <div class="text-h6 q-my-sm">MicroSD card not detected</div>
      <p>
        It seems that the MicroSD card is not mounted or damaged. Insert the
        microSD card into the slot and try again.
      </p>
      <template v-if="showFindMicroSdBtn">
        <q-btn
          unelevated
          color="primary"
          icon="mdi-magnify"
          label="Find MicroSD"
          no-caps
          @click="onFindMicroSd"
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

<script setup lang="ts">
type Props = {
  flat?: boolean
  isDialog?: boolean
  showFindMicroSdBtn?: boolean
}

withDefaults(defineProps<Props>(), {
  flat: false,
  isDialog: false,
  showFindMicroSdBtn: false
})

const emit = defineEmits(['onFindMicroSd'])

const onFindMicroSd = () => {
  emit('onFindMicroSd')
}
</script>
