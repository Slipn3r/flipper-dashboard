<template>
  <div class="info">
    <p>
      <span>Firmware:</span>
      <span>{{ firmwareVersion }}</span>
    </p>
    <p>
      <span>Build date:</span>
      <span>{{ buildDate }}</span>
    </p>
    <p>
      <span>SD card:</span>
      <span>{{ sdCardUsage }}</span>
    </p>
    <p>
      <span>Databases:</span>
      <span>{{ databaseStatus }}</span>
    </p>
    <p>
      <span>Hardware:</span>
      <span>{{ hardwareVersion }}</span>
    </p>
    <p>
      <span>Radio FW:</span>
      <span>{{ radioVersion }}</span>
    </p>
    <p>
      <span>Radio stack:</span>
      <span>{{ _radioStackType }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRadioStackType } from 'entity/Flipper/lib/RadioStackType'

type Props = {
  firmwareVersion?: string
  buildDate?: string
  sdCardUsage: string
  databaseStatus?: string
  hardwareVersion: string
  radioVersion: string
  radioStackType?: string
}

const props = defineProps<Props>()

const _radioStackType = computed(() => {
  return getRadioStackType(props.radioStackType)
})
</script>

<style lang="scss" scoped>
.info p {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 0 0 12px;
  text-wrap: nowrap;

  span:first-of-type {
    font-size: 15px;
    font-weight: 500;
    margin-right: 1.5rem;
  }

  span:last-of-type {
    font-family: monospace;
  }
}
</style>
