export type DeviceInfo = {
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
      region: {
          builtin: string
          provisioned: string
      }
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

export type FlipperInfo = DeviceInfo & PowerInfo

export type File = {
  type?: number
  size?: number
  name: string
}

export type SpaceInfo = {
  totalSpace: number
  freeSpace: number
}
