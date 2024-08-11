import { MessageStream } from './worker-utils.js'
import { GrayImageF32N0F8 } from './image-utils.js'

const bayerCache = [new GrayImageF32N0F8(new Float32Array([0, 3, 2, 1]), 2, 2)]

function calculateBayerLevel (level) {
  if (!bayerCache[level]) {
    const bayerSize = 2 ** (level + 1)
    const bayer = GrayImageF32N0F8.empty(bayerSize, bayerSize)
    const prevLevel = calculateBayerLevel(level - 1)
    const halfSize = bayerSize / 2
    for (const { x, y, pixel } of bayer.allPixels()) {
      const quadrantX = x >= bayerSize / 2 ? 1 : 0
      const quadrantY = y >= bayerSize / 2 ? 1 : 0
      pixel[0] =
        4 * prevLevel.pixelAt(x % halfSize, y % halfSize)[0] +
        bayerCache[0].pixelAt(quadrantX, quadrantY)[0]
    }
    bayerCache[level] = bayer
  }
  return bayerCache[level]
}

async function init () {
  const reader = MessageStream().getReader()

  while (true) {
    const {
      value: { level, id }
    } = await reader.read()

    const bayer = calculateBayerLevel(level)
    const size = bayer.width ** 2
    postMessage({ id, result: bayer.copy().mapSelf(v => v / size) })
  }
}
init()
