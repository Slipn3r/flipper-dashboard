const getRadioStackType = (type?: string) => {
  let intRadioStackType
  if (type) {
    intRadioStackType = parseInt(type)
  }

  switch (intRadioStackType) {
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
      return 'Unknown'
  }
}

export { getRadioStackType }
