import { defaults } from './constants.js'
import {
  getBoundaries,
  combiningPulses,
  filterPulses,
  drawFill,
  drawLine,
  drawText,
  drawHint
} from './utils.js'
const margin = defaults.margin

let width,
  height,
  dpi = null
let data = null
let theme = null

let context,
  labelContext,
  hintsContext = null

let pulses = []
let altHints = []
let barHeight = null
const breakpointZoom = defaults.breakpoints.zoom
const breakpointPulseInOneX = defaults.breakpoints.pulseInOneX
let maxZoom = null

self.onmessage = (e) => {
  switch (e.data.message) {
    case 'setConfigContext':
      width = e.data.width
      height = e.data.height
      dpi = e.data.dpi
      break
    case 'setData':
      data = JSON.parse(e.data.data)
      break
    case 'setTheme':
      theme = e.data.theme
      break
    case 'setMaxZoom':
      maxZoom = e.data.maxZoom
      break
    case 'setBarHeight':
      barHeight = e.data.barHeight
      break
    case 'setAltHints':
      altHints = JSON.parse(e.data.altHints)
      break

    case 'getContext':
      context = context2d(e.data.canvas, width, height, dpi)
      break
    case 'getLabelContext':
      labelContext = context2d(e.data.canvas, width, height, dpi)
      break
    case 'getHintsContext':
      hintsContext = context2d(e.data.canvas, width, height, dpi)
      break

    case 'redrawHintsCanvas':
      redrawHintsCanvas(e.data.transform)
      break
    case 'zoomed':
      zoomed(e.data.transform)
      break
  }
}

const context2d = (canvas, width, height, dpi) => {
  const context = canvas.getContext('2d', { desynchronized: true })
  canvas.width = Math.floor(width * dpi)
  canvas.height = Math.floor(height * dpi)
  context.scale(dpi, dpi)
  return context
}

const drawAllHints = (transform) => {
  const { leftPulse, rightPulse } = getBoundaries(data, width, transform)

  const hints = data.hints.filter((d) => {
    const x0 = d[0]
    const x1 = d[1]
    if (x0 >= leftPulse && x0 <= rightPulse) return true
    if (x1 >= leftPulse && x1 <= rightPulse) return true
    return false
  })

  let prevHint
  for (let i = 0; i < hints.length; i += 1) {
    const hint = hints[i]
    const x0 = hint[0]
    const x1 = hint[1]

    if (prevHint !== x0 && x0 >= 0 && x0 < data.width) {
      drawHint(
        hintsContext,
        x0 * (transform.k / maxZoom) + transform.x,
        height,
        {
          hintLine: theme.hintLine,
          hintStroke: theme.hintStroke,
          hintDash: theme.hintDash
        }
      )
    }
    if (x1 >= 0 && x1 < data.width) {
      drawHint(
        hintsContext,
        x1 * (transform.k / maxZoom) + transform.x,
        height,
        {
          hintLine: theme.hintLine,
          hintStroke: theme.hintStroke,
          hintDash: theme.hintDash
        }
      )
    }
    prevHint = x1
  }

  const filteredAltHints = altHints.filter((d) => {
    const x0 = d[0]
    const x1 = d[1]
    if (x0 >= leftPulse && x0 <= rightPulse) return true
    if (x1 >= leftPulse && x1 <= rightPulse) return true
    return false
  })

  prevHint = null
  for (let i = 0; i < filteredAltHints.length; i += 1) {
    const hint = filteredAltHints[i]
    const x0 = hint[0]
    const x1 = hint[1]

    if (prevHint !== x0 && x0 >= 0 && x0 < data.width) {
      drawHint(
        hintsContext,
        x0 * (transform.k / maxZoom) + transform.x,
        height,
        {
          hintLine: theme.hintAltLine,
          hintStroke: theme.hintAltStroke,
          hintDash: theme.hintAltDash
        }
      )
    }
    if (x1 >= 0 && x1 < data.width) {
      drawHint(
        hintsContext,
        x1 * (transform.k / maxZoom) + transform.x,
        height,
        {
          hintLine: theme.hintAltLine,
          hintStroke: theme.hintAltStroke,
          hintDash: theme.hintAltDash
        }
      )
    }

    prevHint = x1
  }
}

const redrawHintsCanvas = (transform) => {
  hintsContext.save()
  hintsContext.clearRect(0, 0, width, height)

  drawAllHints(transform)

  hintsContext.restore()
}

const zoomed = (transform) => {
  labelContext.save()
  labelContext.clearRect(0, 0, width, height)

  hintsContext.save()
  hintsContext.clearRect(0, 0, width, height)

  context.save()
  context.clearRect(0, 0, width, height)

  drawFill(
    context,
    0,
    -1,
    width,
    barHeight + margin.top + margin.bottom,
    theme.spaceFill
  )

  let prevX = 0
  let skipPulse = 0
  let sum = 0

  const { leftPulse, rightPulse, pulseInOneX } = getBoundaries(
    data,
    width,
    transform
  )

  if (transform.k < breakpointZoom) {
    pulses = combiningPulses(data, pulseInOneX)
    ;({ pulses, sum, prevX, skipPulse } = filterPulses(
      pulses,
      sum,
      prevX,
      skipPulse,
      leftPulse,
      rightPulse
    ))
  } else {
    ;({ pulses, sum, prevX, skipPulse } = filterPulses(
      data.pulses,
      sum,
      prevX,
      skipPulse,
      leftPulse,
      rightPulse
    ))
  }

  for (let i = 0; i < pulses.length; i++) {
    const x = pulses[i]

    if (x) {
      if ((i + skipPulse) % 2 === 0) {
        drawFill(
          context,
          prevX * (transform.k / maxZoom) + transform.x,
          margin.top,
          x * (transform.k / maxZoom),
          barHeight,
          transform.k < breakpointZoom ? theme.combiningFill : theme.hiFill
        )

        drawLine(
          context,
          {
            start: [
              prevX * (transform.k / maxZoom) + transform.x,
              height - barHeight - margin.top + theme.hiLine / 2
            ],
            end: [
              (prevX + x) * (transform.k / maxZoom) + transform.x,
              height - barHeight - margin.top + theme.hiLine / 2
            ]
          },
          {
            lineWidth: theme.hiLine,
            strokeStyle: theme.hiStroke
          }
        )
      } else {
        drawLine(
          context,
          {
            start: [
              prevX * (transform.k / maxZoom) + transform.x,
              height - margin.top - theme.loLine / 2
            ],
            end: [
              (prevX + x) * (transform.k / maxZoom) + transform.x,
              height - margin.top - theme.loLine / 2
            ]
          },
          {
            lineWidth: theme.loLine,
            strokeStyle: theme.loStroke
          }
        )
      }

      const w = x * ((width * transform.k) / data.width)
      if (w > theme.fontSize * 4) {
        drawText(
          labelContext,
          x,
          (prevX + x / 2) * (transform.k / maxZoom) + transform.x,
          height / 2,
          {
            color: theme.fontColor,
            font: `${theme.fontSize}px sans-serif`,
            align: theme.fontAlign,
            baseline: theme.fontBaseline
          }
        )
      }

      if (
        pulseInOneX <= breakpointPulseInOneX &&
        transform.k >= breakpointZoom &&
        (i + skipPulse) % 2 === 0
      ) {
        drawLine(
          context,
          {
            start: [
              prevX * (transform.k / maxZoom) + transform.x,
              height - margin.top
            ],
            end: [
              prevX * (transform.k / maxZoom) + transform.x,
              height - barHeight - margin.top
            ]
          },
          {
            lineWidth: theme.edgeLine,
            strokeStyle: theme.hiStroke
          }
        )

        drawLine(
          context,
          {
            start: [
              (prevX + x) * (transform.k / maxZoom) + transform.x,
              height - barHeight - margin.top
            ],
            end: [
              (prevX + x) * (transform.k / maxZoom) + transform.x,
              height - margin.top
            ]
          },
          {
            lineWidth: theme.edgeLine,
            strokeStyle: theme.loStroke
          }
        )
      }

      prevX = prevX + x
    }
  }

  drawAllHints(transform)

  labelContext.restore()
  hintsContext.restore()
  context.restore()
}
