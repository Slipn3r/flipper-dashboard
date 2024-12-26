export function weightGenerator (length, ratio) {
  return Array.from({ length }, (_, i) => Math.pow(ratio, i / (length - 1)))
}

export function* hilbertCurve (n) {
  if (n === 1) {
    yield 'A'
    return
  }
  for (const instr of hilbertCurve(n - 1)) {
    switch (instr) {
      case 'A':
        yield * '+BF-AFA-FB+'.split('')
        break
      case 'B':
        yield * '-AF+BFB+FA-'.split('')
        break
      default:
        yield instr
    }
  }
}

export function* lsystem2coordinates (it) {
  let direction = 0
  let x = 0
  let y = 0
  yield { x, y }

  for (const instr of it) {
    switch (instr) {
      case 'F':
        x += Math.cos(direction)
        y += Math.sin(direction)
        yield { x: Math.round(x), y: Math.round(y) }
        break
      case '+':
        direction += Math.PI / 2
        break
      case '-':
        direction -= Math.PI / 2
        break
    }
  }
}

export function* hilbertCurveGenerator (width, height) {
  const n = Math.ceil(Math.log2(Math.max(width, height)))
  yield * lsystem2coordinates(hilbertCurve(n + 1))
}
