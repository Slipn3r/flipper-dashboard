import { GrayImageF32N0F8 } from './image-utils.js'

function pointEqual (p, q) {
  return p.x === q.x && p.y === q.y
}

function shuffle (arr) {
  const a = arr.slice()
  for (let i = a.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
  return a
}

function tightestCluster (img, gaussian) {
  const blur = img.fftGaussianBlur(gaussian)
  let coords
  let bestValue = Number.NEGATIVE_INFINITY
  for (const p of img.allCoordinates()) {
    if (img.valueAt(p) !== 1.0) {
      continue
    }
    const value = blur.valueAt(p)
    if (bestValue < value) {
      bestValue = value
      coords = p
    }
  }
  return coords
}

function largestVoid (img, gaussian) {
  const blur = img.fftGaussianBlur(gaussian)
  let coords
  let bestValue = Number.POSITIVE_INFINITY
  for (const p of img.allCoordinates()) {
    if (img.valueAt(p) !== 0.0) {
      continue
    }
    const value = blur.valueAt(p)
    if (bestValue > value) {
      bestValue = value
      coords = p
    }
  }
  return coords
}

const size = 64
const numPixels = size ** 2
const binaryPattern = GrayImageF32N0F8.empty(size, size)
const initFraction = 0.1
const gaussian = 1.5

const start = performance.now()

// Set a small number of pixels to white
const numOnes = Math.floor(numPixels * initFraction)
const ones = shuffle([...binaryPattern.allCoordinates()]).slice(0, numOnes)
for (const p of ones) {
  binaryPattern.setValueAt(p, 1.0)
}

// Reorder pixels to be evenly distributed
while (true) {
  const tcluster = tightestCluster(binaryPattern, gaussian)
  binaryPattern.setValueAt(tcluster, 0.0)
  const lvoid = largestVoid(binaryPattern, gaussian)
  // If turning the tightest cluster pixel black also makes it the
  // largest void, we are done. Don’t forget to put the white pixel back!
  if (pointEqual(tcluster, lvoid)) {
    binaryPattern.setValueAt(tcluster, 1.0)
    break
  }
  binaryPattern.setValueAt(lvoid, 1.0)
}

const dither = GrayImageF32N0F8.empty(size, size)
// Phase 1
const pattern = binaryPattern.copy()
for (let i = numOnes - 1; i >= 0; i--) {
  const c = tightestCluster(pattern, gaussian)
  pattern.setValueAt(c, 0.0)
  dither.setValueAt(c, i)
}

// Phase 2
for (let i = numOnes; i < Math.floor(numPixels / 2); i++) {
  const v = largestVoid(binaryPattern, gaussian)
  binaryPattern.setValueAt(v, 1.0)
  dither.setValueAt(v, i)
}

// Phase 3
binaryPattern.mapSelf(v => 1.0 - v)
for (let i = Math.floor(numPixels / 2); i < numPixels; i++) {
  const c = tightestCluster(binaryPattern, gaussian)
  binaryPattern.setValueAt(c, 0.0)
  dither.setValueAt(c, i)
}

// Normalize
dither.mapSelf(v => v / numPixels)

postMessage({
  mask: dither,
  duration: performance.now() - start
})
