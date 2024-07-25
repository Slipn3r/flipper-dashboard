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

const props = defineProps({
  firmwareVersion: {
    type: String,
    required: true
  },
  buildDate: {
    type: String,
    required: true
  },
  sdCardUsage: {
    type: String,
    required: true
  },
  databaseStatus: {
    type: String,
    required: true
  },
  hardwareVersion: {
    type: String,
    required: true
  },
  radioVersion: {
    type: String,
    required: true
  },
  radioStackType: {
    type: String,
    required: true
  }
})

const _radioStackType = computed(() => {
  switch (parseInt(props.radioStackType)) {
    case 0x01:
      return 'full'
    case 0x02:
      return 'BLE_HCI'
    case 0x03:
      return 'light'
    case 0x04:
      return 'BLE_BEACON'
    case 0x05:
      return 'BLE_BASIC'
    case 0x06:
      return 'BLE_FULL_EXT_ADV'
    case 0x07:
      return 'BLE_HCI_EXT_ADV'
    case 0x10:
      return 'THREAD_FTD'
    case 0x11:
      return 'THREAD_MTD'
    case 0x30:
      return 'ZIGBEE_FFD'
    case 0x31:
      return 'ZIGBEE_RFD'
    case 0x40:
      return 'MAC'
    case 0x50:
      return 'BLE_THREAD_FTD_STATIC'
    case 0x51:
      return 'BLE_THREAD_FTD_DYAMIC'
    case 0x60:
      return '802154_LLD_TESTS'
    case 0x61:
      return '802154_PHY_VALID'
    case 0x62:
      return 'BLE_PHY_VALID'
    case 0x63:
      return 'BLE_LLD_TESTS'
    case 0x64:
      return 'BLE_RLV'
    case 0x65:
      return '802154_RLV'
    case 0x70:
      return 'BLE_ZIGBEE_FFD_STATIC'
    case 0x71:
      return 'BLE_ZIGBEE_RFD_STATIC'
    case 0x78:
      return 'BLE_ZIGBEE_FFD_DYNAMIC'
    case 0x79:
      return 'BLE_ZIGBEE_RFD_DYNAMIC'
    case 0x80:
      return 'RLV'
    case 0x90:
      return 'BLE_MAC_STATIC'
    default:
      return props.radioStackType
  }
})
</script>

<style lang="scss" scoped>
.info p {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 0 0 12px;
  font-family: monospace;
  font-size: 16px;

  span:first-of-type {
    font-weight: 600;
    margin-right: 1.5rem;
  }
}
</style>
