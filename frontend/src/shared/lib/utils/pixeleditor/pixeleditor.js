import { $, _, BEM, getTop, getLeft } from './dom.js'

/* drawing helper functions */

// line drawing algorithm
function bres (x0, y0, x1, y1) {
  const pts = []
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy

  let safety = 0
  while (true) {
    if (safety++ > (parseInt(dx + dy) || 2)) {
      console.warn('bres reached safety valve!')
      break
    }
    pts.push([x0, y0])
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
  return pts
}

function rect (x0, y0, x1, y1) {
  if (x1 < x0) {
    [x0, x1] = [x1, x0]
  }
  if (y1 < y0) {
    [y0, y1] = [y1, y0]
  }
  const pts = []
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      pts.push([x, y])
    }
  }
  return pts
}

// flood fill algorithm
function flood (data, x, y, width, value) {
  const seen = {}
  const height = (data.length / width) | 0
  const idx = (x, y) => width * y + x
  const start = idx(x, y)
  const bg = data[start]
  const stack = [start]
  seen[start] = true
  while (stack.length) {
    const pos = stack.pop()
    if (data[pos] === bg) {
      data[pos] = value
      const x = pos % width
      const y = (pos / width) | 0
      if (x < width - 1 && !seen[pos + 1]) {
        seen[pos + 1] = true
        stack.push(pos + 1)
      }
      if (x > 0 && !seen[pos - 1]) {
        seen[pos - 1] = true
        stack.push(pos - 1)
      }
      if (y < height - 1 && !seen[pos + width]) {
        seen[pos + width] = true
        stack.push(pos + width)
      }
      if (y > 0 && !seen[pos - width]) {
        seen[pos - width] = true
        stack.push(pos - width)
      }
    }
  }
}

// returns the coordinates of a mouseevent relative to an element
function getRelativePoint (event, el, zoom) {
  const left = getLeft(el)
  const top = getTop(el)
  return [
    ((event.pageX - left - 1) / zoom) | 0,
    ((event.pageY - top - 1) / zoom) | 0
  ]
}

const tools = ['draw', 'erase', 'line', 'rect', 'fill']
const defaultColors = [
  [255, 255, 255],
  [0, 0, 0]
]

export default class PixelEditor {
  constructor ({
    width,
    height = width,
    colors = defaultColors,
    zoom = 4,
    currentColor = 1,
    bg = 0,
    container,
    onUpdate,
    // afterDraw
  } = {}) {
    this.bem = BEM('pE')
    this.width = width
    this.height = height
    this.zoom = zoom
    this.colors = colors
    this.currentColor = currentColor
    this.bg = bg
    this.data = new Uint8Array(width * height).fill(bg)
    this.mode = 'draw'
    this.undoStack = []
    this.redoStack = []
    this.onUpdate = onUpdate
    // this.afterDraw = afterDraw
    this.save()
    this.undoStack.pop()
    this.dataChanged = false
    this.lastDraw = null
    this.mouseEventsQueue = []
    if (container) {
      this.mount(container)
    }
  }

  // saves an undo snapshot, optionally with sizing information
  save (saveSizing) {
    this.undoStack.push({
      data: [...this.data],
      ...(saveSizing && {
        width: this.width,
        height: this.height,
        zoom: this.zoom
      })
    })
  }

  // restores to the previous undo snapshot, if available
  undo () {
    if (this.undoStack.length) {
      const popped = this.undoStack.pop()
      this.redoStack.push({ data: this.data })
      if (popped.width || popped.height || popped.zoom) {
        this.resize({ ...popped, noSave: true })
      }
      this.data = popped.data
      this.dataChanged = true
      this.draw()
      this.updated()
    }
  }

  // restores to the previous redo snapshot, if available
  redo () {
    if (this.redoStack.length) {
      const popped = this.redoStack.pop()
      this.undoStack.push({ data: this.data })
      if (popped.width || popped.height || popped.zoom) {
        this.resize({ ...popped, noSave: true })
      }
      this.data = popped.data
      this.dataChanged = true
      this.draw()
      this.updated()
    }
  }

  // set the whole canvas to a single color
  clear (color) {
    if (typeof color === 'undefined') {
      color = this.bg
    }
    this.save()
    this.data.fill(color)
    this.dataChanged = true
    this.draw()
    this.updated()
  }

  setData (data) {
    this.data = data
    this.dataChanged = true
    this.save()
    this.draw()
    this.updated()
  }

  // construct the DOM, and set event listeners
  render () {
    const { b, e } = this.bem

    this.canvas = _(`canvas.${e('drawing')}`, {
      width: this.width * this.zoom,
      height: this.height * this.zoom
    })

    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      imageSmoothingEnabled: false
    })

    this.el = _(
      `div.pixeleditor.${b}`,
      {
        tabindex: 0
      },
      _(`div.${e('canvas')}`, this.canvas)
    )

    /* event listeners */

    this.el.addEventListener('keydown', e => {
      if (!this.p0) {
        this.p0 = [0, 0]
      }
      const cursor = this.p0
      if (!e.metaKey && !e.ctrlKey) {
        if (e.altKey) {
          // alt-x
          if (e.code === 'KeyX') {
            this.clear()
          }
        } else {
          e.preventDefault()
          if (e.code === 'ArrowRight') {
            cursor[0] = Math.min(cursor[0] + 1, this.width - 1)
          }
          if (e.code === 'ArrowLeft') {
            cursor[0] = Math.max(cursor[0] - 1, 0)
          }
          if (e.code === 'ArrowDown') {
            cursor[1] = Math.min(cursor[1] + 1, this.height - 1)
          }
          if (e.code === 'ArrowUp') {
            cursor[1] = Math.max(cursor[1] - 1, 0)
          }

          if (e.code === 'KeyZ') {
            this.undo()
          }

          if (e.code === 'KeyU') {
            this.redo()
          }

          if (e.code === 'KeyL') {
            this.setMode('line')
          }
          if (e.code === 'KeyD') {
            this.setMode('draw')
          }
          if (e.code === 'KeyE') {
            this.setMode('erase')
          }
          if (e.code === 'KeyR') {
            this.setMode('rect')
          }
          if (e.code === 'KeyF') {
            this.setMode('fill')
          }
          // if (e.code === 'BracketRight') {
          //   let newColor = this.currentColor + 1
          //   if (newColor >= this.colors.length) {
          //     newColor = 0
          //   }
          //   this.setColor(newColor)
          // }
          // if (e.code === 'BracketLeft') {
          //   let newColor = this.currentColor - 1
          //   if (newColor < 0) {
          //     newColor = this.colors.length - 1
          //   }
          //   this.setColor(newColor)
          // }

          if (e.code === 'Space') {
            if (this.mode === 'draw' || this.mode === 'erase') {
              if (this.drawing) {
                this.updated()
              } else {
                this.save()
              }
              this.drawing = !this.drawing
            }
            if (this.mode === 'line') {
              if (this.drawing) {
                this.plotLine(this.p0, this.p1)
                this.updated()
              } else {
                this.save()
                this.p1 = [...cursor]
              }
              this.drawing = !this.drawing
            }
            if (this.mode === 'rect') {
              if (this.drawing) {
                this.plotRect(this.p0, this.p1)
                this.updated()
              } else {
                this.save()
                this.p1 = [...cursor]
              }
              this.drawing = !this.drawing
            }
            if (this.mode === 'fill') {
              this.save()
              flood(this.data, ...cursor, this.width, this.currentColor)
              this.dataChanged = true
              this.updated()
            }
          }
        }
      }

      if (this.drawing) {
        if (this.mode === 'draw' || this.mode === 'erase') {
          this.plotPoint(...cursor)
        }
      }

      this.draw()
    })

    this.canvas.addEventListener('mousedown', e => {
      const [x, y] = getRelativePoint(e, this.canvas, this.zoom)

      if (this.mode === 'draw' || this.mode === 'erase') {
        this.save()
        this.plotPoint(x, y)
        this.drawing = true
      }
      if (this.mode === 'line' || this.mode === 'rect') {
        this.drawing = true
        this.p0 = [x, y]
        this.p1 = [x, y]
        this.draw()
      }
      if (this.mode === 'fill') {
        this.save()
        flood(this.data, x, y, this.width, this.currentColor)
        this.dataChanged = true
        this.draw()
        this.updated()
      }
    })

    this.canvas.addEventListener('mousemove', e => {
      const [x, y] = getRelativePoint(e, this.canvas, this.zoom)

      if (!this.p0 || x !== this.p0[0] || y !== this.p0[1]) {
        this.p0 = [x, y]
        this.draw()
      }
      if (this.drawing && this.mode === 'draw' || this.mode === 'erase') {
        this.mouseEventsQueue.push([x, y])
        if (this.mouseEventsQueue.length === 1) {
          this.handleMouseDraw()
        }
        // this.plotPoint(x, y)
      }
      if (this.drawing && (this.mode === 'line' || this.mode === 'rect')) {
        if (x !== this.p0[0] || y !== this.p0[1]) {
          this.p0 = [x, y]
          this.draw()
        }
      }
    })

    this.el.addEventListener('mouseup', () => {
      if (this.drawing && this.mode === 'line') {
        this.save()
        this.plotLine(this.p0, this.p1)
        this.draw()
        this.updated()
      }
      if (this.drawing && this.mode === 'rect') {
        this.save()
        this.plotRect(this.p0, this.p1)
        this.draw()
        this.updated()
      }
      if (this.drawing && this.mode === 'draw' || this.mode === 'erase') {
        this.updated()
        this.mouseEventP0 = null
      }
      this.drawing = false
    })

    this.el.addEventListener('blur', () => {
      this.p0 = null
      this.draw()
      this.mouseEventP0 = null
    })

    this.el.addEventListener('mouseleave', () => {
      if (this.drawing && this.mode === 'draw' || this.mode === 'erase') {
        this.updated()
        this.mouseEventP0 = null
      }
      if (!(this.mode === 'line' || this.mode === 'rect')) {
        this.drawing = false
      }
    })
  }

  handleMouseDraw () {
    while (this.mouseEventsQueue.length) {
      const [x, y] = this.mouseEventsQueue[0]
      if (!this.mouseEventP0) {
        this.plotPoint(x, y)
      } else if (!(this.mouseEventP0[0] === x && this.mouseEventP0[1] === y)) {
        this.plotLine([x, y], this.mouseEventP0)
      }
      this.mouseEventP0 = [x, y]
      this.mouseEventsQueue.shift()
    }
  }

  // draw a single point
  plotPoint (x, y, c) {
    if (typeof c === 'undefined') {
      c = this.currentColor
    }
    const idx = y * this.width + x
    if (this.data[idx] !== c) {
      this.data[idx] = c
      this.dataChanged = true
      this.ctx.fillRect(x * this.zoom, y * this.zoom, this.zoom, this.zoom)
      // this.draw()
    }
  }

  // draw a rectangle
  plotRect (p0, p1, c) {
    if (typeof c === 'undefined') {
      c = this.currentColor
    }
    rect(...p0, ...p1).forEach(p => {
      this.data[p[1] * this.width + p[0]] = c
    })
    this.dataChanged = true
    this.draw()
  }

  // draw a line
  plotLine (p0, p1, c) {
    if (typeof c === 'undefined') {
      c = this.currentColor
    }
    bres(...p0, ...p1).forEach(p => {
      this.data[p[1] * this.width + p[0]] = c
      this.ctx.fillStyle = this.currentColor === 0 ? '#ffffff' : '#000000'
      this.ctx.fillRect(p[0] * this.zoom, p[1] * this.zoom, this.zoom, this.zoom)
    })
    this.dataChanged = true
    // this.draw()
  }

  // change the drawing mode
  setMode (mode) {
    if (tools.indexOf(mode) > -1) {
      $(`button[aria-mode="${mode}"]`).click()
      this.mode = mode
    }
  }

  // re-render the drawing with a reticle and pending line if applicable
  draw () {
    const ctx = this.ctx
    this.ctx.save()
    const { width, height, zoom } = this
    let drawData = this.data
    if (this.drawing && this.mode === 'line') {
      drawData = [...this.data]
      bres(...this.p0, ...this.p1).forEach(p => {
        drawData[p[1] * width + p[0]] = this.currentColor
      })
      this.dataChanged = true
    }
    if (this.drawing && this.mode === 'rect') {
      drawData = [...this.data]
      rect(...this.p0, ...this.p1).forEach(p => {
        drawData[p[1] * width + p[0]] = this.currentColor
      })
      this.dataChanged = true
    }
    let id = this.lastDraw
    if (this.dataChanged || !this.lastDraw) {
      id = new ImageData(width * zoom, height * zoom)
      for (let i = 0; i < id.data.length; i += 4) {
        const x = (i / 4) % this.canvas.width
        const y = (i / 4 / this.canvas.width) | 0
        const px = (x / zoom) | 0
        const py = (y / zoom) | 0
        const c = this.colors[drawData[py * width + px]]
        id.data[i] = c[0]
        id.data[i + 1] = c[1]
        id.data[i + 2] = c[2]
        id.data[i + 3] = 255
      }
      this.lastDraw = id
    } else {
      id = this.lastDraw
    }
    this.dataChanged = false
    this.ctx.putImageData(id, 0, 0)
    if (this.p0) {
      const rx = this.p0[0] * zoom
      const ry = this.p0[1] * zoom
      // const z = zoom / 2
      ctx.globalCompositeOperation = 'difference'
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(rx - 1, ry - 1, zoom + 1, zoom + 1)
    }
    this.ctx.restore()
    // if (this.afterDraw) {
    //   this.afterDraw(this.ctx, this)
    // }
  }

  // notify onUpdated callback
  updated () {
    if (this.onUpdate) {
      this.onUpdate(this)
    }
  }

  // change the size of the drawing canvas
  resize ({ /* width, height, */ zoom, noSave = true }) {
    if (!noSave) {
      this.save(true)
    }
    const oldWidth = this.width
    const oldHeight = this.height
    // const oldZoom = this.zoom
    const oldData = this.data

    // if (width) {
    //   this.width = parseInt(width)
    // }
    // if (height) {
    //   this.height = parseInt(height)
    // }
    if (zoom) {
      this.zoom = parseInt(zoom)
    }

    this.canvas.width = this.width * this.zoom
    this.canvas.height = this.height * this.zoom
    this.data = new Uint8Array(this.width * this.height).fill(0)

    for (let i = 0; i < this.data.length; i++) {
      const x = i % this.width
      const y = (i / this.width) | 0
      if (x < oldWidth && y < oldHeight) {
        this.data[i] = oldData[y * oldWidth + x]
      }
    }
    this.dataChanged = true
    this.draw()
  }

  // append the widget to a container
  mount (container) {
    this.render()
    container.append(this.el)
    this.draw()
  }

  /* export formats */
  // return an ImageData of the drawing at the specified zoom
  toImageData ({ zoom = 1 } = {}) {
    const { width, height } = this
    const id = new ImageData(width * zoom, height * zoom)
    const drawData = this.data
    for (let i = 0; i < id.data.length; i += 4) {
      const x = (i / 4) % (width * zoom)
      const y = (i / 4 / (width * zoom)) | 0
      const px = (x / zoom) | 0
      const py = (y / zoom) | 0
      const c = this.colors[drawData[py * width + px]]
      id.data[i] = c[0]
      id.data[i + 1] = c[1]
      id.data[i + 2] = c[2]
      id.data[i + 3] = 255
    }
    return id
  }

  // returns an "image/png" Blob of the drawing at the specified zoom
  toBlob ({ zoom = 1 } = {}) {
    return new Promise((resolve) => {
      const id = this.toImageData({ zoom })
      const canvas = _('canvas', {
        width: id.width,
        height: id.height
      })
      canvas.getContext('2d').putImageData(id, 0, 0)
      canvas.toBlob(resolve)
    })
  }
}
