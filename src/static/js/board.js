import Piece from './piece.js'

export default class Board {

  static width = 10
  static height = 21

  tiles = []
  pieces = []
  deletions = []
  isFull = false
  isDropping = false
  linesDestroyed = []

  constructor() {
    for(let row = 0; row < Board.height; row++) {
      this.tiles.push(new Array(Board.width).fill(0))
    }
  }

  get current() {
    return this.pieces[this.pieces.length - 1]
  }

  left() {
    const clone = this.current.clone()
    clone.column -= 1
    if(this.isNotWithinBounds(clone.row, clone.column)) return
    if(this.overlayIntesects(clone)) return
    this.current.column -= 1
  }

  right() {
    const clone = this.current.clone()
    clone.column += 1
    if(this.isNotWithinBounds(clone.row, clone.maxColumnExtent)) return
    if(this.overlayIntesects(clone)) return
    this.current.column += 1
  }

  rotate() {
    const clone = this.current.clone()
    clone.rotate()
    if(this.isNotWithinBounds(clone.maxRowExtent, clone.maxColumnExtent)) return
    if(this.overlayIntesects(clone)) return
    this.current.rotate()
  }

  getNextPiece() {
    this.isDropping = true
    this.pieces.push(Piece.randomPiece)
  }

  isNotWithinBounds(row, column) {
    return row < 0 || row >= Board.height || column < 0 || column >= Board.width
  }

  collapse() {
    let dropAmount = 0
    for(let row = 0; row < Board.height; row++) {
      if(!this.tiles[row].includes(0)) {
        dropAmount++
        this.tiles.splice(row, 1)
        this.tiles.unshift(new Array(Board.width).fill(0))
      }
    }
    this.linesDestroyed.push(dropAmount)
  }

  overlayIntesects(piece) {
    if(piece.row > 0 && this.isNotWithinBounds(piece.maxRowExtent, piece.maxColumnExtent)) return true
    for(let dr = 0; dr < piece.height; dr++) {
      for(let dc = 0; dc < piece.width; dc++) {
        if(piece.row + dr > Board.height) return true
        const value = piece.matrix[dr][dc]
        if(value !== 1) continue
        const boardRow = piece.row + dr
        const boardColumn = piece.column + dc
        if(this.isNotWithinBounds(boardRow, boardColumn)) continue
        const boardValue = this.tiles[boardRow][boardColumn] 
        if(value && boardValue) return true
      }
    }
  }

  overlayMatrix(piece) {
    for(let dr = 0; dr < piece.height; dr++) {
      for(let dc = 0; dc < piece.width; dc++) {
        const value = piece.matrix[dr][dc]
        if(value !== 1) continue
        const boardRow = piece.row + dr
        const boardColumn = piece.column + dc
        if(this.isNotWithinBounds(boardRow, boardColumn)) continue
        this.tiles[boardRow][boardColumn] = value
      }
    }
  } 

  update() {
    if(this.pieces.length < 1) return
    this.current.row += 1
    if(this.overlayIntesects(this.current)) {
      this.current.row--
      this.overlayMatrix(this.current)
      this.collapse()
      this.isDropping = false
      this.isFull = this.isFull || this.pieces.some(piece => piece.row < 0)
    }

  }

}