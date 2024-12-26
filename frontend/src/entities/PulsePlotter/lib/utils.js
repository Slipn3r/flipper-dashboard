const selector = (elementOrSelector) => {
  if (!elementOrSelector) {
    return null
  }

  if (typeof elementOrSelector === 'string') {
    return document.querySelector(elementOrSelector)
  }

  return elementOrSelector
}

const getBoundaries = (data, width, transform) => {
  // const minLeftSide = 0
  const maxRightSide = width * transform.k
  const pulseInOneX = data.width / maxRightSide
  const leftSide = ~~(transform.x * -1)
  const rightSide = ~~(transform.x * -1 + width)
  // const pulseRate = data.width / transform.k
  const leftPulse = leftSide * pulseInOneX
  const rightPulse = rightSide * pulseInOneX

  return { leftPulse, rightPulse, pulseInOneX }
}

const combiningPulses = (data, pulseInOneX) => {
  const pulses = []
  let prevX = 0

  for (let i = 0; i < data.pulses.length; i++) {
    if (i % 2 !== 0) {
      if (data.pulses[i] >= pulseInOneX * 10) {
        pulses.push(prevX)
        pulses.push(data.pulses[i])
        prevX = 0
        continue
      }
    }

    prevX += data.pulses[i]
  }

  if (prevX !== 0) {
    pulses.push(prevX)
  }

  return pulses
}

const filterPulses = (data, sum, prevX, skipPulse, leftPulse, rightPulse) => {
  const pulses = data.filter((d) => {
    const minX = sum
    sum += d
    const maxX = sum
    if (maxX >= leftPulse && minX <= rightPulse) return true
    if (minX < leftPulse) {
      prevX += d
      skipPulse += 1
    }
    return false
  })

  return { pulses, sum, prevX, skipPulse }
}

const drawFill = (context, x, y, width, height, color) => {
  context.beginPath()
  context.fillStyle = color
  context.fillRect(x, y, width, height)
  context.closePath()
}

const drawLine = (context, coordinates, options) => {
  context.beginPath()
  context.lineWidth = options.lineWidth
  context.strokeStyle = options.strokeStyle
  context.moveTo(...coordinates.start)
  context.lineTo(...coordinates.end)
  context.stroke()
  context.closePath()
}

const drawText = (context, text, x, y, options) => {
  context.beginPath()
  context.fillStyle = options.color
  context.font = options.font
  context.textAlign = options.align
  context.textBaseline = options.baseline
  context.fillText(text, x, y)
  context.closePath()
}

const drawHint = (context, x, height, options) => {
  context.lineWidth = options.hintLine
  context.strokeStyle = options.hintStroke
  context.setLineDash(options.hintDash)
  context.beginPath()
  context.moveTo(x, 0)
  context.lineTo(x, height)
  context.stroke()
  context.setLineDash([])
}

export {
  selector,
  getBoundaries,
  combiningPulses,
  filterPulses,
  drawFill,
  drawLine,
  drawText,
  drawHint
}
