import Matrix from './matrix.js'
import Board from './board.js'

export default class Piece {

  static colors = ['#EC1C24', '#FFF100', '#EB008B', '#1B75BB', '#00ADEE', '#8BC53F', '#F6921E']
  static textures = ['Texture1', 'Texture2', 'Texture3', 'Texture4', 'Texture5']

  static get IBlock() {
    return new IBlock()
  }

  static get JBlock() {
    return new JBlock()
  }

  static get LBlock() {
    return new JBlock()
  }

  static get OBlock() {
    return new OBlock()
  }

  static get SBlock() {
    return new SBlock()
  }

  static get TBlock() {
    return new TBlock()
  }

  static get ZBlock() {
    return new ZBlock()
  }

  static get randomPiece() {
    const pieces = [Piece.IBlock, Piece.JBlock, Piece.LBlock, Piece.OBlock, Piece.SBlock, Piece.TBlock, Piece.ZBlock]
    const index = Math.floor(Math.random() * pieces.length)
    const piece = pieces[index]
    const column = Math.floor(Math.random() * (Board.width - piece.width))
    piece.column = column
    return piece
  }
  
  static get randomColor() {
    return Piece.colors[Math.floor(Math.random() * Piece.colors.length)]
  }

  static get randomTexture() {
    return Piece.textures[Math.floor(Math.random() * Piece.textures.length)]
  }

  constructor(matrices, row = -4, column = 0, rotation = 0) {
    this.matrices = matrices
    this.matrix = matrices[rotation]
    this.row = row
    this.column = column
    this.color = Piece.randomColor
    this.texture = Piece.randomTexture
  }

  get width() {
    return this.matrix.width
  }

  get height() {
    return this.matrix.height
  }

  get maxRowExtent() {
    let index = 0
    for(let row = 0; row < this.height; row++) {
      if(this.matrix[row].includes(1)) (index = row)
    }

    return this.row + index
  }

  get maxColumnExtent() {
    let index = 0
    for(let row = 0; row < this.height; row++) {
      const lastIndex = this.matrix[row].lastIndexOf(1)
      if(lastIndex > index) (index = lastIndex)
    }

    return this.column + index
  }

  collapse() {
    for(let row = 0; row < this.height; row++) {
      if(!this.matrix[row].includes(1)) {
        this.matrix.splice(row, 1)
        this.matrix.unshift(new Array(this.width))
      }
    }
  }

  rotate() {
    this.rotation = this.rotation + 1 < this.matrices.length ? this.rotation + 1 : 0
    this.matrix = this.matrices[this.rotation]
  }

  clone() {
    return new Piece(this.matrices, this.row, this.column, this.rotation)
  }

}

class IBlock extends Piece {

  static matrices = [
    new Matrix([1, 1, 1, 1]), 
    new Matrix([1], [1], [1], [1]),
    new Matrix([1, 1, 1, 1]),
    new Matrix([1], [1], [1], [1]),
  ]

  constructor() {
    super(IBlock.matrices)
  }

}


class JBlock extends Piece {

  static matrices = [
    new Matrix([1, 0, 0], [1, 1, 1]),
    new Matrix([1, 1], [1, 0], [1, 0]),
    new Matrix([1, 1, 1], [0, 0, 1]),
    new Matrix([0, 1], [0, 1], [1, 1]),
  ]

  constructor() {
    super(JBlock.matrices)
  }

}


class LBlock extends Piece {

  static matrices = [
    new Matrix([0, 0, 1], [1, 1, 1]),
    new Matrix([1, 0], [1, 0], [1, 1]),
    new Matrix([1, 1, 1], [1, 0, 0]),
    new Matrix([1, 1], [0, 1], [0, 1]),
  ]

  constructor() {
    super(LBlock.matrices)
  }

}


class OBlock extends Piece {

  static matrices = [
    new Matrix([1, 1], [1, 1]),
    new Matrix([1, 1], [1, 1]),
    new Matrix([1, 1], [1, 1]),
    new Matrix([1, 1], [1, 1]),
  ]

  constructor() {
    super(OBlock.matrices)
  }

}


class SBlock extends Piece {

  static matrices = [
    new Matrix([0, 1, 1], [1, 1, 0]),
    new Matrix([1, 0], [1, 1], [0, 1]),
    new Matrix([0, 1, 1], [1, 1, 0]),
    new Matrix([1, 0], [1, 1], [0, 1]),
  ]

  constructor() {
    super(SBlock.matrices)
  }

}


class TBlock extends Piece {

  static matrices = [
    new Matrix([0, 1, 0], [1, 1, 1]),
    new Matrix([1, 0], [1, 1], [1, 0]),
    new Matrix([1, 1, 1], [0, 1, 0]),
    new Matrix([0, 1], [1, 1], [0, 1]),
  ]

  constructor() {
    super(TBlock.matrices)
  }

}



class ZBlock extends Piece {

  static matrices = [
    new Matrix([1, 1, 0], [0, 1, 1]),
    new Matrix([0, 1], [1, 1], [1, 0]),
    new Matrix([1, 1, 0], [0, 1, 1]),
    new Matrix([0, 1], [1, 1], [1, 0]),
  ]

  constructor() {
    super(ZBlock.matrices)
  }

}