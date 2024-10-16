export type DeviceInfo = {
  doneReading: boolean
  format: {
    major: string
    minor: string
  }
  hardware: {
    model: string
    uid: string
    otp: {
      ver: string
    }
    timestamp: string
    ver: string
    target: string
    body: string
    connect: string
    display: string
    color: string
    region:
      | {
          builtin: string
          provisioned: string
        }
      | '0'
    name: string
  }
  firmware: {
    commit: {
      hash: string
      dirty: string
    }
    branch: {
      name: string
      num: string
    }
    version: string
    build: {
      date: string
    }
    target: string
    api: {
      major: string
      minor: string
    }
    origin: {
      fork: string
      git: string
    }
  }
  radio: {
    alive: string
    mode: string
    fus: {
      major: string
      minor: string
      sub: string
      sram2b: string
      sram2a: string
      flash: string
    }
    stack: {
      type: string
      major: string
      minor: string
      sub: string
      branch: string
      release: string
      sram2b: string
      sram2a: string
      sram1: string
      flash: string
    }
    ble: {
      mac: string
    }
  }
  enclave: {
    keys: {
      valid: string
    }
    valid: string
  }
  system: {
    debug: string
    lock: string
    orient: string
    sleep: {
      legacy: string
    }
    stealth: string
    heap: {
      track: string
    }
    boot: string
    locale: {
      time: string
      date: string
      unit: string
    }
    log: {
      level: string
    }
  }
  protobuf: {
    version: {
      major: string
      minor: string
    }
  }
}

export type PowerInfo = {
  format: {
    major: string
    minor: string
  }
  charge: {
    level: string
    state: string
    voltage: {
      limit: string
    }
  }
  battery: {
    voltage: string
    current: string
    temp: string
    health: string
  }
  capacity: {
    remain: string
    full: string
    design: string
  }
}

export type SpaceInfo = {
  totalSpace: number
  freeSpace: number
}

export type StorageInfo = {
  storage: {
    sdcard?: {
      status: {
        label?: string
        isInstalled?: boolean
      }
      totalSpace?: number
      freeSpace?: number
    }
    databases?: {
      status?: string
    }
    internal?: SpaceInfo | object
  }
}

export type FlipperInfo = DeviceInfo & PowerInfo & StorageInfo

export type File = {
  type?: number
  size?: number
  name: string
}

export type App = {
  id: string
  name: string
  icon: string
  installedVersion: {
    id: string
    api: string
  }
  path: string
  devCatalog?: string
}

type FirmwareFile = {
  sha256: string
  target: string
  type: string
  url: string
}

type FirmwareVersion = {
  changelog: string
  files: FirmwareFile[]
  timestamp: number
  version: string
}

export type Channel = {
  [key: string]: string | FirmwareVersion[]
  id: string
  title: string
  description: string
  versions: FirmwareVersion[]
}

type Band = {
  [key: string]: {
    duty_cycle: number
    end: number
    max_power: number
    start: number
  }
}

type Country = {
  [key: string]: string[]
}

export type Regions = {
  bands: Band
  countries: Country
  country: string
  default: string[]
}

export type PulseFile = {
  data: Uint8Array
  name: string
}

import type { Emitter, DefaultEvents } from 'nanoevents'

export type DataFlipperElectron = {
  emitter: Emitter<DefaultEvents>
  mode: string
  name: string
  info: {
    device: {
      info: DeviceInfo['format']
    }
    enclave: {
      valid: DeviceInfo['enclave']['valid']
    }
    firmware: Omit<DeviceInfo['firmware'], 'commit' | 'branch'> & {
      commit: string
      branch: string
    }
    hardware: Omit<DeviceInfo['hardware'], 'region'> & {
      region: string
    }
    protobuf: DeviceInfo['protobuf']
    radio: DeviceInfo['radio']
    system: DeviceInfo['system']
  }
}

export type DataDfuFlipperElectron = {
  emitter: Emitter<DefaultEvents>
  mode: string
  name: string
  info: {
    body: number
    color: number
    connect: number
    display: number
    format: number
    name: DeviceInfo['hardware']['name']
    region: number
    target: number
    timestamp: number
    version: number
  }
}

type InputKey = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT' | 'OK' | 'BACK'
type InputType = 'PRESS' | 'RELEASE' | 'SHORT' | 'LONG' | 'REPEAT'
export interface InputEvent {
  key: InputKey
  type: InputType
}
