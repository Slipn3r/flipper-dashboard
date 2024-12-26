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
    downloadFolder(args: {
      basePath?: string
      isUserAction: boolean
      structure: FolderStructure | FileStructure
      event?: Event
    }): Promise<
      | {
          status: 'error'
          message: string
        }
      | {
          status: 'ok' | 'warning'
          path: string
        }
    >
  }
  logger: {
    log: (level: string, message: string, context: string) => void
  }
}

interface FileStructure {
  name: string
  type: number
  rawData?: Uint8Array
}
interface FolderStructure {
  name: string
  type: number
  data: (FolderStructure | FileStructure)[]
}
