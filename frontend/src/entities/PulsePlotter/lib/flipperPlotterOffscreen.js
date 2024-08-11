/* eslint-disable-next-line camelcase */
import { autorange, autorange_time } from './autorange.js'
import { sliceGuess } from './slicer.js'
import { selector } from './utils.js'
import { Analyzer } from './histogram.js'
import { defaults, styles, slicerOptions } from './constants.js'
// import * as d3 from 'd3'
import { zoomTransform, zoomIdentity, select, create, zoom, axisTop, scaleLinear } from 'd3'

export default class FlipperPlotterOffscreen {
  get slicerOptions () {
    return slicerOptions
  }

  constructor (options = {}) {
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

    this.initialPlotter(options)

    window.onresize = () => {
      this.destroy()

      this.initialPlotter(options)
    }
  }

  initialPlotter (options) {
    this.createWorker()
    this.setTheme(options.theme)
    this.createNode()
    this.initialCanvas()
    this.processData(this.data)
    this.drawCanvas()
  }

  createWorker () {
    this.worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
  }

  setTheme (options) {
    this.theme = { ...defaults.theme, ...options }

    this.worker.postMessage({ message: 'setTheme', theme: this.theme })
  }

  setSlicer (params) {
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

  setSlicerData (pulses, slicer) {
    const slice = sliceGuess(pulses, slicer)
    const timings = this.timingsNode
    const messages = this.messagesNode
    this.analyzer.print(timings, messages)

    if (slice.hints) {
      this.data.hints = slice.hints
      this.altHints = this.getAltHints(slice.hints)
      this.worker.postMessage({
        message: 'setAltHints',
        altHints: JSON.stringify(this.altHints)
      })
    }

    if (slice.bits) {
      this.data.bits = slice.bits

      if (messages) {
        messages.innerHTML += `<div>Bits: <strong>${slice.bits.toHexString()}</strong></div>`
      }
    }
  }

  getAltHints (hints) {
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

  createNode () {
    const flipperPlotter = select(this.parent)
    this.flipperPlotterNode = flipperPlotter.node()

    this.axisSvg = create('svg')
    const axisSvgNode = this.axisSvg.node()

    const wrapper = create('div')
      .attr('style', styles.relativePosition + styles.fullWidth)
    const wrapperNode = wrapper.node()

    const labelCanvas = create('canvas')
      .attr('style', styles.absoluteTopLeft + styles.fullWidth)
    this.labelCanvasNode = labelCanvas.node()

    const hintsCanvas = create('canvas')
      .attr('style', styles.absoluteTopLeft + styles.fullWidth)
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

  initialCanvas () {
    this.width = this.pulsesCanvasNode.clientWidth
    this.height = defaults.height

    this.worker.postMessage({
      message: 'setConfigContext',
      width: this.width,
      height: this.height,
      dpi: window.devicePixelRatio
    })

    this.pulsesOffscreen = this.pulsesCanvasNode.transferControlToOffscreen()
    this.worker.postMessage(
      { message: 'getContext', canvas: this.pulsesOffscreen },
      [this.pulsesOffscreen]
    )

    this.labelOffscreen = this.labelCanvasNode.transferControlToOffscreen()
    this.worker.postMessage(
      { message: 'getLabelContext', canvas: this.labelOffscreen },
      [this.labelOffscreen]
    )

    this.hintsOffscreen = this.hintsCanvasNode.transferControlToOffscreen()
    this.worker.postMessage(
      { message: 'getHintsContext', canvas: this.hintsOffscreen },
      [this.hintsOffscreen]
    )
  }

  processData (data) {
    let width = 0
    for (let j = 0; j < this.data.pulses.length; ++j) {
      width += this.data.pulses[j]
    }
    this.data.width = width

    this.data.hints = []
    this.altHints = []

    if (!this.slicer) {
      this.analyzer = new Analyzer(data.pulses)
      this.guess = this.analyzer.guess()
      this.slicer = this.guess
    }

    this.setSlicerData(data.pulses, this.slicer)

    this.worker.postMessage({
      message: 'setData',
      data: JSON.stringify(this.data)
    })
  }

  zoomed (transform) {
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

    this.worker.postMessage({ message: 'zoomed', transform })
  }

  redrawHintsCanvas (transform) {
    this.worker.postMessage({ message: 'redrawHintsCanvas', transform })
  }

  drawCanvas () {
    this.margin = defaults.margin

    this.barHeight = this.height - this.margin.top - this.margin.bottom
    this.worker.postMessage({
      message: 'setBarHeight',
      barHeight: this.barHeight
    })

    const minZoom = 1
    const maxZoom = this.data.width / this.width
    this.worker.postMessage({ message: 'setMaxZoom', maxZoom })

    this.xScale = scaleLinear()
      .range([0, this.width])
      .domain([0, this.data.width])

    this.xScaleCopy = this.xScale.copy()

    const xAxis = axisTop(this.xScale)
      .ticks(this.width / 100)
      .tickFormat((x) => `(${x.toFixed(1)})`)

    select(this.pulsesCanvasNode)
      .attr('width', this.width)
      .attr('height', this.height)
      .call(
        zoom()
          .scaleExtent([minZoom, maxZoom])
          .on('zoom', ({ transform }) => this.zoomed(transform))
      )

    const labelСanvas = select(this.labelCanvasNode)
      .attr('width', this.width)
      .attr('height', this.height)
      .style('cursor', 'grab')
      .call(
        zoom()
          .scaleExtent([minZoom, maxZoom])
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

    this.zoomed(zoomIdentity)
  }

  destroy () {
    this.worker.terminate()
    this.flipperPlotterNode.innerHTML = ''
  }
}
