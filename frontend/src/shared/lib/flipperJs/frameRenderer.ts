const config = {
  width: 128,
  height: 64,
  activeColor: 'black',
  inactiveColor: '#ff8201'
}

export default class FrameRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor(width = config.width, height = config.height) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')!

    this.ctx.lineWidth = 1
    this.ctx.lineCap = 'square'
    this.ctx.imageSmoothingEnabled = false
    this.ctx.fillStyle = config.inactiveColor
    this.ctx.fillRect(0, 0, width, height)
    this.ctx.fillStyle = config.activeColor
  }

  public getCanvas() {
    return this.canvas
  }

  public renderFrame({
    data,
    activeColor = config.activeColor,
    inactiveColor = config.inactiveColor
  }: {
    data: Uint8Array
    activeColor?: string
    inactiveColor?: string
  }) {
    if (!data) {
      return
    }

    for (let x = 0; x < 128; x++) {
      for (let y = 0; y < 64; y++) {
        const i = Math.floor(y / 8) * 128 + x
        const z = y & 7

        const dataAt = data.at(i)
        if (dataAt && dataAt & (1 << z)) {
          this.ctx.fillStyle = activeColor
        } else {
          this.ctx.fillStyle = inactiveColor
        }

        this.ctx.fillRect(x, y, 1, 1)
      }
    }
  }
}
