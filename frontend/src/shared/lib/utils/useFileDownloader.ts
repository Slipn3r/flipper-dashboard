import { FlipperModel } from 'entity/Flipper'

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
  return await window.fs.downloadFolder({ structure, isUserAction: true })
}
