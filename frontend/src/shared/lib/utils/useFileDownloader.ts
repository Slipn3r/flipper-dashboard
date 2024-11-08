import { FlipperModel } from 'entities/Flipper'

export async function downloadFile({
  file,
  rawData
}: {
  file: FlipperModel.File
  rawData: Uint8Array
}) {
  if (file.type === 0 && file.size) {
    await window.fs.downloadFile({ filename: file.name, rawData })
  }
}
