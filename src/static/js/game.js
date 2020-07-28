import Board from './board.js'
import { KEYS } from './constants.js'
import { setCookie } from './util.js'

export default class Game {

  ref = null
  paused = false
  stopped = true

  fps = 1
  score = 0
  lastTime = 0

  graphic = 'modern'
  graphics = { 'modern': 'Graphic-Modern', 'original': 'Graphic-Original' }
  started = false
  gameOver = false

  constructor(container, audio, ui) {

    this.ui = ui
    this.container = container
    this.audio = audio
    this.board = new Board()

    this.start = this.start.bind(this)
    this.onkeyup = this.onkeyup.bind(this)
    this.onkeydown = this.onkeydown.bind(this)
    this.onkeypress = this.onkeypress.bind(this)
    this.mainloop = this.mainloop.bind(this)

    this.update(0)
  }

  get fpsInterval() {
    return 1000 / this.fps
  }
 
  // game logic
  
  // event handlers
  onkeyup(event) {
    if(event.keyCode === KEYS.S || event.keyCode === KEYS.DOWN) (this.fps = 1)
  }

  onkeydown(event) {
    if(event.keyCode === KEYS.S || event.keyCode === KEYS.DOWN) (this.fps = 60)
  }

  onkeypress(event) {
    if(!this.started) this.start()
    if(this.gameOver) return
    if(event.keyCode === KEYS.W || event.keyCode === KEYS.UP) (this.board.rotate())
    if(event.keyCode === KEYS.A || event.keyCode === KEYS.LEFT) (this.board.left())
    if(event.keyCode === KEYS.D || event.keyCode === KEYS.RIGHT) (this.board.right())
    if(event.keyCode === KEYS.SPACE) (this.fps = 60)
    this.render()
  }

  // rendering methods

  start() {
    this.stop()
    this.audio.load()
    this.audio.currentTime = 0
    this.audio.play()
    this.started = true
    this.paused = false
    this.stopped = false
    this.mainloop()
  }

  stop() {
    cancelAnimationFrame(this.ref)
    this.lastTime = 0
    this.stopped = true
  }

  pause() {
    this.paused = true
  }

  unpause() {
    this.paused = false
  }

  displayTile(tile) {
    const div = document.createElement('div')
    const cls = this.graphics[this.graphic]
    div.classList.add(cls)
    if(tile === 1) (div.style.background = 'grey')
    this.container.appendChild(div)
  }

  displayPiece(piece) {
    for(let dr = 0; dr < piece.height; dr++) {
      for(let dc = 0; dc < piece.width; dc++) {
        if(piece.matrix[dr][dc] !== 1) continue
        const index = ((piece.row + dr) * Board.width) + (piece.column + dc)
        const child = this.container.children[index]
        if(child == null) return
        child.style.background = piece.color
      }
    }
  }

  render() {
    this.container.innerHTML = ""
    this.board.tiles.forEach(row => row.forEach(tile => this.displayTile(tile)))
    this.displayPiece(this.board.current)
  }

  update(delta) {

    if(this.board.isFull) {
      this.stop()
      this.ui.EndScreen.style.opacity = 1
    }

    if(!this.board.isDropping) {
      let toAdd = 0
      const lastIndex = this.board.linesDestroyed.length - 1
      const line = this.board.linesDestroyed[lastIndex]
      if(line === 1) (toAdd = 40)
      if(line === 2) (toAdd = 100)
      if(line === 3) (toAdd = 300)
      if(line === 4) (toAdd = 1200)
      if(this.score + toAdd) {
        setCookie('highscore', this.score + toAdd, 30)
        this.ui.HighScore.innerHTML = this.score + toAdd
      }
      this.score += toAdd
      this.fps = 1
      this.board.getNextPiece()
      this.ui.CurrentScore.innerHTML = this.score
    }

    this.board.update()
    this.render()

  }

  mainloop(delta) {
    if(this.stopped) return
    this.ref = requestAnimationFrame(this.mainloop)
    if(this.paused) return

    const elapsed = delta - this.lastTime
    if(elapsed < this.fpsInterval) return
    this.lastTime = delta

    // ... logic below here runs at the 60 fps
    this.update(delta)

  }

}