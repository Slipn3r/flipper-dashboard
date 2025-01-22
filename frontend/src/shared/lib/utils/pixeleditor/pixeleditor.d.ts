interface PixelEditorOptions {
  width: number
  height?: number
  colors?: [number, number, number][]
  zoom?: number
  currentColor?: number
  bg?: number
  container?: Element | null
  onUpdate?(editor: PixelEditor): void
}

declare class PixelEditor {
  p0?: [number, number]
  p1?: [number, number]
  width: number
  height: number
  zoom: number
  colors: [number, number, number][]
  currentColor: number
  bg: number
  data: Uint8Array
  mode: string
  dataChanged: boolean
  drawing: boolean

  constructor(options?: PixelEditorOptions)
  save(saveSizing?: boolean): void
  undo(): void
  redo(): void
  clear(color?: number): void
  setData(data: number[]): void
  setMode(mode: string): void
  plotPoint(x: number, y: number, c?: number): void
  plotLine(p0?: [number, number], p1?: [number, number], c?: number): void
  plotRect(p0?: [number, number], p1?: [number, number], c?: number): void
  draw(): void
  updated(): void
  resize(opts: { zoom?: number; noSave?: boolean }): void
  mount(container: HTMLElement): void
  toImageData(opts?: { zoom?: number }): ImageData
  toBlob(opts?: { zoom?: number }): Promise<Blob | null>
}

export default PixelEditor
