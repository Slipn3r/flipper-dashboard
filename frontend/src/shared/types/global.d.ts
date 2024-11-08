interface Window {
  bridge: {
    send: (payload: {
      type: string
      name: string
      data: {
        buffer?: string
        mode?: string
        file?: string
      }
    }) => void
  }
  fs: {
    saveToTemp(
      args: { filename: string; buffer: void | Uint8Array },
      event?: Event
    ): Promise<
      | {
          status: string
          path: string
          message?: string
        }
      | {
          status: string
          message: string
          path?: string
        }
    >
    downloadFile(
      args: {
        filename: string
        rawData: Uint8Array
      },
      event?: Event
    ): Promise<
      | {
          status: string
          path: string
          message?: string
        }
      | {
          status: string
          message: string
          path?: string
        }
    >
  }
}
