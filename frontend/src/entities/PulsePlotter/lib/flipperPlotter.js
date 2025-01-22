import { autorange, autorange_time } from './autorange.js'
import { sliceGuess } from './slicer.js'
import {
  selector,
  getBoundaries,
  combiningPulses,
  filterPulses,
  drawFill,
  drawLine,
  drawText,
  drawHint
} from './utils.js'
import { Analyzer } from './histogram.js'
import { defaults, styles, slicerOptions } from './constants.js'
// import * as d3 from 'd3'
import { zoomTransform, select, create, zoom, axisTop, scaleLinear } from 'd3'

export default class FlipperPlotter {
  get slicerOptions() {
    return slicerOptions
  }

  constructor(options = {}) {
    if (!options.data) {
      console.error(new Error('Required data missing for flipperPlotter'))
      return
    } else {
      this.data = options.data
    }

    if (options.parent) {
      this.parent = selector(options.parent)
    } else {
      this.parent = selector(defaults.selector)
    }

    if (options.timings) {
      this.timings = selector(options.timings)
    }

    if (options.messages) {
      this.messages = selector(options.messages)
    }

    if (!this.parent) {
      console.error(new Error('Missing mount element for flipperPlotter'))
      return
    }

    this.setTheme(options.theme)
    this.processData(this.data)

    this.initialPlotter(options)

    window.onresize = () => {
      this.destroy()

      this.initialPlotter()
    }
  }

  initialPlotter() {
    this.createNode()
    this.initialCanvas()
    this.drawCanvas()
  }

  setTheme(options) {
    this.theme = { ...defaults.theme, ...options }
  }

  setSlicer(params) {
    if (params && params.modulation) {
      this.slicer = params
    } else if (this.data && this.data.modulation) {
      this.slicer = this.data
    } else {
      this.slicer = this.guess
    }

    if (!this.data.pulses || !this.data.pulses.length) return

    this.setSlicerData(this.data.pulses, this.slicer)

    this.redrawHintsCanvas(zoomTransform(this.labelCanvasNode))
  }

  setSlicerData(pulses, slicer) {
    const slice = sliceGuess(pulses, slicer)
    const timings = this.timingsNode
    const messages = this.messagesNode
    this.analyzer.print(timings, messages)

    if (slice.hints) {
      this.data.hints = slice.hints
      this.altHints = this.getAltHints(slice.hints)
    }

    if (slice.bits) {
      this.data.bits = slice.bits

      if (messages) {
        messages.innerHTML += `<div>Bits: <strong>${slice.bits.toHexString()}</strong></div>`
      }
    }
  }

  getAltHints(hints) {
    const altHints = []
    if (hints) {
      let prevHint
      for (let i = 0; i < hints.length; i++) {
        const d = hints[i]
        const x0 = d[0]

        if (i > 0 && prevHint[1] !== x0) {
          altHints.push([prevHint[1], x0])
        }

        prevHint = d
      }
    }

    return altHints
  }

  createNode() {
    const flipperPlotter = select(this.parent)
    this.flipperPlotterNode = flipperPlotter.node()

    this.axisSvg = create('svg')
    const axisSvgNode = this.axisSvg.node()

    const wrapper = create('div').attr(
      'style',
      styles.relativePosition + styles.fullWidth
    )
    const wrapperNode = wrapper.node()

    const labelCanvas = create('canvas').attr(
      'style',
      styles.absoluteTopLeft + styles.fullWidth
    )
    this.labelCanvasNode = labelCanvas.node()

    const hintsCanvas = create('canvas').attr(
      'style',
      styles.absoluteTopLeft + styles.fullWidth
    )
    this.hintsCanvasNode = hintsCanvas.node()

    const pulsesCanvas = create('canvas').attr('style', styles.fullWidth)
    this.pulsesCanvasNode = pulsesCanvas.node()

    let timingsDiv
    if (this.timings) {
      timingsDiv = select(this.timings)
    } else {
      timingsDiv = create('div')
    }
    this.timingsNode = timingsDiv.node()

    let messagesDiv
    if (this.messages) {
      messagesDiv = select(this.messages)
    } else {
      messagesDiv = create('div')
    }
    this.messagesNode = messagesDiv.node()

    this.flipperPlotterNode.append(axisSvgNode)
    wrapperNode.append(this.hintsCanvasNode)
    wrapperNode.append(this.labelCanvasNode)
    wrapperNode.append(this.pulsesCanvasNode)
    this.flipperPlotterNode.append(wrapperNode)

    if (!this.timings) {
      this.flipperPlotterNode.append(this.timingsNode)
    }
    if (!this.messages) {
      this.flipperPlotterNode.append(this.messagesNode)
    }
  }

  initialCanvas() {
    this.width = this.pulsesCanvasNode.clientWidth
    this.height = defaults.height

    this.context = this.context2d(
      this.pulsesCanvasNode,
      this.width,
      this.height
    )
    this.labelContext = this.context2d(
      this.labelCanvasNode,
      this.width,
      this.height
    )
    this.hintsContext = this.context2d(
      this.hintsCanvasNode,
      this.width,
      this.height
    )
  }

  processData(data) {
    let width = 0
    for (let j = 0; j < this.data.pulses.length; ++j) {
      width += this.data.pulses[j]
    }
    this.data.width = width

    this.data.hints = []
    this.altHints = []

    this.analyzer = new Analyzer(data.pulses)
    this.guess = this.analyzer.guess()
    this.slicer = this.guess

    this.setSlicerData(data.pulses, this.slicer)
  }

  context2d(canvas, width, height, dpi) {
    const context = canvas.getContext('2d', { desynchronized: true })
    if (dpi == null) dpi = window.devicePixelRatio
    canvas.width = Math.floor(width * dpi)
    canvas.height = Math.floor(height * dpi)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.scale(dpi, dpi)
    return context
  }

  drawAllHints(transform) {
    const { leftPulse, rightPulse } = getBoundaries(
      this.data,
      this.width,
      transform
    )

    const hints = this.data.hints.filter((d) => {
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

      if (prevHint !== x0 && x0 >= 0 && x0 < this.data.width) {
        drawHint(
          this.hintsContext,
          x0 * (transform.k / this.maxZoom) + transform.x,
          this.height,
          {
            hintLine: this.theme.hintLine,
            hintStroke: this.theme.hintStroke,
            hintDash: this.theme.hintDash
          }
        )
      }
      if (x1 >= 0 && x1 < this.data.width) {
        drawHint(
          this.hintsContext,
          x1 * (transform.k / this.maxZoom) + transform.x,
          this.height,
          {
            hintLine: this.theme.hintLine,
            hintStroke: this.theme.hintStroke,
            hintDash: this.theme.hintDash
          }
        )
      }
      prevHint = x1
    }

    const altHints = this.altHints.filter((d) => {
      const x0 = d[0]
      const x1 = d[1]
      if (x0 >= leftPulse && x0 <= rightPulse) return true
      if (x1 >= leftPulse && x1 <= rightPulse) return true
      return false
    })

    prevHint = null
    for (let i = 0; i < altHints.length; i += 1) {
      const hint = altHints[i]
      const x0 = hint[0]
      const x1 = hint[1]

      if (prevHint !== x0 && x0 >= 0 && x0 < this.data.width) {
        drawHint(
          this.hintsContext,
          x0 * (transform.k / this.maxZoom) + transform.x,
          this.height,
          {
            hintLine: this.theme.hintAltLine,
            hintStroke: this.theme.hintAltStroke,
            hintDash: this.theme.hintAltDash
          }
        )
      }
      if (x1 >= 0 && x1 < this.data.width) {
        drawHint(
          this.hintsContext,
          x1 * (transform.k / this.maxZoom) + transform.x,
          this.height,
          {
            hintLine: this.theme.hintAltLine,
            hintStroke: this.theme.hintAltStroke,
            hintDash: this.theme.hintAltDash
          }
        )
      }

      prevHint = x1
    }
  }

  zoomed(transform) {
    if (transform.x > 0) transform.x = 0
    if (transform.x + this.width * transform.k < this.width) {
      transform.x = this.width - this.width * transform.k
    }

    this.xScale = transform.rescaleX(this.xScaleCopy)

    const currentRange = autorange(this.data.width / transform.k)
    const currentTimeRange = autorange_time(this.data.width / 1e6 / transform.k)

    this.axisSvg.select('.x-axis').call(
      axisTop(this.xScale)
        .ticks(this.width / 100)
        .tickFormat(
          (x) =>
            (x / currentRange.scale).toFixed(2).replace(/[.,]00$/, '') +
            `${currentTimeRange.prefix}`
        )
    )

    this.labelContext.save()
    this.labelContext.clearRect(0, 0, this.width, this.height)

    this.hintsContext.save()
    this.hintsContext.clearRect(0, 0, this.width, this.height)

    this.context.save()
    this.context.clearRect(0, 0, this.width, this.height)

    drawFill(
      this.context,
      0,
      -1,
      this.width,
      this.barHeight + this.margin.top + this.margin.bottom,
      this.theme.spaceFill
    )

    let prevX = 0
    let skipPulse = 0
    let sum = 0

    const { leftPulse, rightPulse, pulseInOneX } = getBoundaries(
      this.data,
      this.width,
      transform
    )

    if (transform.k < this.breakpointZoom) {
      this.pulses = combiningPulses(this.data, pulseInOneX)
      ;({
        pulses: this.pulses,
        sum,
        prevX,
        skipPulse
      } = filterPulses(
        this.pulses,
        sum,
        prevX,
        skipPulse,
        leftPulse,
        rightPulse
      ))
    } else {
      ;({
        pulses: this.pulses,
        sum,
        prevX,
        skipPulse
      } = filterPulses(
        this.data.pulses,
        sum,
        prevX,
        skipPulse,
        leftPulse,
        rightPulse
      ))
    }

    for (let i = 0; i < this.pulses.length; i++) {
      const x = this.pulses[i]

      if (x) {
        if ((i + skipPulse) % 2 === 0) {
          drawFill(
            this.context,
            prevX * (transform.k / this.maxZoom) + transform.x,
            this.margin.top,
            x * (transform.k / this.maxZoom),
            this.barHeight,
            transform.k < this.breakpointZoom
              ? this.theme.combiningFill
              : this.theme.hiFill
          )

          drawLine(
            this.context,
            {
              start: [
                prevX * (transform.k / this.maxZoom) + transform.x,
                this.height -
                  this.barHeight -
                  this.margin.top +
                  this.theme.hiLine / 2
              ],
              end: [
                (prevX + x) * (transform.k / this.maxZoom) + transform.x,
                this.height -
                  this.barHeight -
                  this.margin.top +
                  this.theme.hiLine / 2
              ]
            },
            {
              lineWidth: this.theme.hiLine,
              strokeStyle: this.theme.hiStroke
            }
          )
        } else {
          drawLine(
            this.context,
            {
              start: [
                prevX * (transform.k / this.maxZoom) + transform.x,
                this.height - this.margin.top - this.theme.loLine / 2
              ],
              end: [
                (prevX + x) * (transform.k / this.maxZoom) + transform.x,
                this.height - this.margin.top - this.theme.loLine / 2
              ]
            },
            {
              lineWidth: this.theme.loLine,
              strokeStyle: this.theme.loStroke
            }
          )
        }

        const w = x * ((this.width * transform.k) / this.data.width)
        if (w > this.theme.fontSize * 4) {
          drawText(
            this.labelContext,
            x,
            (prevX + x / 2) * (transform.k / this.maxZoom) + transform.x,
            this.height / 2,
            {
              color: this.theme.fontColor,
              font: `${this.theme.fontSize}px sans-serif`,
              align: this.theme.fontAlign,
              baseline: this.theme.fontBaseline
            }
          )
        }

        if (
          pulseInOneX <= this.breakpointPulseInOneX &&
          transform.k >= this.breakpointZoom &&
          (i + skipPulse) % 2 === 0
        ) {
          drawLine(
            this.context,
            {
              start: [
                prevX * (transform.k / this.maxZoom) + transform.x,
                this.height - this.margin.top
              ],
              end: [
                prevX * (transform.k / this.maxZoom) + transform.x,
                this.height - this.barHeight - this.margin.top
              ]
            },
            {
              lineWidth: this.theme.edgeLine,
              strokeStyle: this.theme.hiStroke
            }
          )

          drawLine(
            this.context,
            {
              start: [
                (prevX + x) * (transform.k / this.maxZoom) + transform.x,
                this.height - this.barHeight - this.margin.top
              ],
              end: [
                (prevX + x) * (transform.k / this.maxZoom) + transform.x,
                this.height - this.margin.top
              ]
            },
            {
              lineWidth: this.theme.edgeLine,
              strokeStyle: this.theme.loStroke
            }
          )
        }

        prevX = prevX + x
      }
    }

    this.drawAllHints(transform)

    this.labelContext.restore()
    this.hintsContext.restore()
    this.context.restore()
  }

  redrawHintsCanvas(transform) {
    this.hintsContext.save()
    this.hintsContext.clearRect(0, 0, this.width, this.height)

    this.drawAllHints(transform)

    this.hintsContext.restore()
  }

  drawCanvas() {
    this.margin = defaults.margin
    this.barHeight = this.height - this.margin.top - this.margin.bottom

    this.pulses = []
    this.breakpointZoom = defaults.breakpoints.zoom
    this.breakpointPulseInOneX = defaults.breakpoints.pulseInOneX

    const minZoom = 1
    this.maxZoom = this.data.width / this.width

    this.xScale = scaleLinear()
      .range([0, this.width])
      .domain([0, this.data.width])

    this.xScaleCopy = this.xScale.copy()

    const xAxis = axisTop(this.xScale)
      .ticks(this.width / 100)
      .tickFormat((x) => `(${x.toFixed(1)})`)

    // d3.select(this.pulsesCanvasNode)
    //   .call(
    //     d3
    //       .zoom()
    //       .scaleExtent([minZoom, this.maxZoom])
    //       .on('zoom', ({ transform }) => this.zoomed(transform))
    //   )

    const labelСanvas = select(this.labelCanvasNode)
      .style('cursor', 'grab')
      .call(
        zoom()
          .scaleExtent([minZoom, this.maxZoom])
          .on('start', () => {
            labelСanvas.style('cursor', 'grabbing')
          })
          .on('zoom', (e) => {
            if (e.sourceEvent.type === 'wheel') {
              labelСanvas.style('cursor', 'ns-resize')
            }
            this.zoomed(e.transform)
          })
          .on('end', () => {
            labelСanvas.style('cursor', 'grab')
          })
      )

    const axisHeight = 18
    this.axisSvg
      .attr('viebox', [0, 0, this.width, axisHeight])
      .attr('width', this.width)
      .attr('height', axisHeight)
    this.axisSvg.append('g').classed('x-axis', true).call(xAxis)

    select('.x-axis').attr('transform', `translate(${[0, axisHeight]})`)

    this.zoomed(zoomTransform(this.labelCanvasNode))
  }

  destroy() {
    this.flipperPlotterNode.innerHTML = ''
  }
}
