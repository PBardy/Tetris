import Game from './game.js'
import { getCookie } from './util.js'

const js = Array.from(document.querySelectorAll('.js'))
const ui = Object.fromEntries(js.map(val => [val.id, val]))

const game = new Game(ui.GameContainer, ui.Audio, ui)
ui.HighScore.innerHTML = getCookie('highscore') || 0

window.addEventListener('keyup', game.onkeyup, false)
window.addEventListener('keydown', game.onkeydown, false)
window.addEventListener('keydown', game.onkeypress, false)