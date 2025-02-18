import { FlipperModel } from 'entity/Flipper'

export class FileNavigator {
  private items: FlipperModel.File[]
  public currentIndex: number | null
  private container: HTMLElement

  constructor(items: FlipperModel.File[], container: HTMLElement) {
    this.items = items
    this.container = container

    this.currentIndex = null
  }

  public setCurrentIndex(index: number | null) {
    this.currentIndex = index
  }

  public setItems(items: FlipperModel.File[]) {
    this.items = items
  }

  public computeCols(): number {
    if (this.container) {
      const containerWidth = this.container.clientWidth
      const firstItem = this.container.firstElementChild
      const itemWidth = firstItem?.getBoundingClientRect().width || 250
      return Math.floor(containerWidth / itemWidth) || 1
    }
    return 1
  }

  private get totalRows(): number {
    return Math.ceil(this.items.length / this.computeCols())
  }

  private itemsInRow(row: number): number {
    if (row === this.totalRows - 1) {
      const remainder = this.items.length % this.computeCols()
      return remainder === 0 ? this.computeCols() : remainder
    }
    return this.computeCols()
  }

  public navigate(
    direction: 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp'
  ): number {
    let newIndex

    if (this.currentIndex === null) {
      newIndex = 0
    } else {
      const cols = this.computeCols()
      const idx = this.currentIndex
      const currentRow = Math.floor(idx / cols)
      const currentCol = idx % cols
      newIndex = idx

      switch (direction) {
        case 'ArrowRight': {
          const rowCount = this.itemsInRow(currentRow)
          let newCol = currentCol + 1
          if (newCol >= rowCount) {
            newCol = 0
          }
          newIndex = currentRow * cols + newCol
          break
        }
        case 'ArrowLeft': {
          const rowCount = this.itemsInRow(currentRow)
          let newCol = currentCol - 1
          if (newCol < 0) {
            newCol = rowCount - 1
          }
          newIndex = currentRow * cols + newCol
          break
        }
        case 'ArrowDown': {
          let nextRow = currentRow + 1
          if (nextRow >= this.totalRows) {
            nextRow = 0 // wrap-around to the first line
          }
          const nextRowCount = this.itemsInRow(nextRow)
          let newCol = currentCol
          if (newCol >= nextRowCount) {
            newCol = nextRowCount - 1
          }
          newIndex = nextRow * cols + newCol
          break
        }
        case 'ArrowUp': {
          let prevRow = currentRow - 1
          if (prevRow < 0) {
            prevRow = this.totalRows - 1 // wrap-around to the last line
          }
          const prevRowCount = this.itemsInRow(prevRow)
          let newCol = currentCol
          if (newCol >= prevRowCount) {
            newCol = prevRowCount - 1
          }
          newIndex = prevRow * cols + newCol
          break
        }
      }
    }

    this.currentIndex = newIndex
    return newIndex
  }
}
