import { xbmValues } from './xbm-values'

export function imageDataToXBM (imageData) {
  const data = imageData.data
  let pixel = 0
  let actualRow = 1
  const xbmBytes = []

  for (let c = 0; c < 64; c++) {
    for (let c2 = 0; c2 < 128 / 8; c2++) {
      const hexBits = []
      for (let c3 = 0; c3 < 8; c3++) {
        const pixelIsBlack = !(data[pixel * 4])
        if (pixelIsBlack) { hexBits.push(c3) }
        pixel++
        const isNewRow = pixel / (128 * actualRow) === 1
        if (isNewRow) {
          actualRow++
          break
        }
      }
      for (let c4 = 0; c4 < 256; c4++) {
        if (JSON.stringify(xbmValues[String(c4)]) === JSON.stringify(hexBits)) {
          xbmBytes.push(c4)
        }
      }
    }
  }

  return xbmBytes
}
