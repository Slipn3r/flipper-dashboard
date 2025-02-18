import { FlipperModel } from 'entity/Flipper'
import { exportFile, Platform } from 'quasar'

import JSZip from 'jszip'

const isFileStructure = (
  structure: FolderStructure | FileStructure
): structure is FileStructure => {
  return structure && 'rawData' in structure
}

const isFolderStructure = (
  structure: FolderStructure | FileStructure
): structure is FolderStructure => {
  return structure && 'data' in structure
}

const addToZip = async (
  zip: JSZip,
  structure: FolderStructure | FileStructure
) => {
  if (structure.type === 1) {
    const folder = zip.folder(structure.name)
    if (folder) {
      if (isFolderStructure(structure)) {
        for (const item of structure.data) {
          await addToZip(folder, item)
        }
      }
    }
  } else {
    if (isFileStructure(structure)) {
      if (structure.rawData) {
        zip.file(structure.name, structure.rawData)
      }
    }
  }
}

const downloadFolderZip = async (
  folderStructure: FolderStructure | FileStructure
) => {
  try {
    const zip = new JSZip()
    await addToZip(zip, folderStructure)
    zip.generateAsync({ type: 'blob' }).then((content) => {
      exportFile(`${folderStructure.name}.zip`, content)
    })

    return { status: 'ok', path: null }
  } catch (error) {
    let result
    if (error instanceof ErrorEvent || error instanceof Error) {
      result = error.message
    } else {
      result = String(error)
    }
    return { status: 'error', message: result }
  }
}

export async function downloadFile({
  file,
  rawData
}: {
  file: FlipperModel.File
  rawData: Uint8Array
}) {
  if (file.type === 0 && file.size) {
    return await window.fs.downloadFile({ filename: file.name, rawData })
  }
}

export async function downloadFolder({
  structure
}: {
  structure: FolderStructure | FileStructure
}) {
  if (Platform.is.electron) {
    return await window.fs.downloadFolder({ structure, isUserAction: true })
  }

  return downloadFolderZip(structure)
}
