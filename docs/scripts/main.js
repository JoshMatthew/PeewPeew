// SET UP CANVAS AND GAME CONTEXT
const canv = document.getElementById('cnv')
canv.width = window.visualViewport.width
canv.height = window.visualViewport.height
const ctx = canv.getContext('2d')
// ================================

// SET UP GLOBAL VARIABLES
let enemies = []
const enemyNum = 5
const player1 = new Player()
let winVolume = 0.310
let looseVolume = 0.125

// =================================

// GLOBAL FUNCTIONS TO INITIALIZE GAME

// FUNCTION DECLARATIONS TO START THE GAME
function fillEnemy(i) {
  setTimeout(() => {
    let enemy = new Enemy()
    enemies.push(enemy)
  }, 1000 * i)
}

function playGame() {
  drawWindow()
  // Populate enemy array
  for (let i = 0; i < enemyNum; i++) {
    fillEnemy(i)
  }

  let interval = setInterval(() => {

    if (!enemies.length) {
      stop(interval)
    } else
      if (player1.life <= 0) {
        stopDead(interval)
      } else {
        start()
      }

  }, 1000 / 60)
}

function setUp() {
  initializePlayer(player1)
  initializeEnemies(enemies)
}

function wall(obj) {
  if (obj.pos.x < 0) {
    obj.pos.x = canv.width - obj.size.w
  }
  if (obj.pos.x > canv.width) {
    obj.pos.x = 0
  }
  if (obj.pos.y < 0) {
    obj.pos.y = canv.height - obj.size.h
  }
  if (obj.pos.y > canv.height) {
    obj.pos.y = 0
  }
}

function drawWindow() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canv.width, canv.height)
}

function start() {
  drawWindow()
  setUp()
}

function stopDead(interval) {
  let audio = new Audio("../assets/sfx/defeat-sound.mp3")
  audio.volume = looseVolume
  audio.play()

  ctx.shadowColor = null
  ctx.shadowBlur = null
  ctx.fillStyle = '#fff'

  ctx.font = "100px Arial";
  ctx.textAlign = 'center'
  ctx.fillText('YOU LOOSE', canv.width / 2, canv.height / 2);

  clearInterval(interval)
}

function stop(interval) {
  let audio = new Audio("../assets/sfx/win-sound.mp3")
  audio.volume = winVolume
  audio.play()

  ctx.shadowColor = null
  ctx.shadowBlur = null
  ctx.fillStyle = '#fff'

  ctx.font = "100px Arial";

  ctx.textAlign = 'center'
  ctx.fillText('YOU WIN', canv.width / 2, canv.height / 2);

  clearInterval(interval)
}

// =================================

// INITIALIZATION FUNCTIONS FOR EACH GAME OBJECTS

// Player
function initializePlayer(player) {
  wall(player)
  player.drawParticle()
  player.draw()
  player.move()
  player.autoFiring()
  player.drawBullets(enemies)
}

// Enemies
function initializeEnemies(enemies) {

  for (let i = 0; i < enemies.length; i++) {
    wall(enemies[i])
    enemies[i].isDead(i)
    enemies[i].follow(player1)
    enemies[i].cutParticles()
    enemies[i].draw()
    enemies[i].drawBullets(player1)
    enemies[i].move()

    for (let j = 0; j < enemies.length; j++) {
      i !== j && enemies[i].isColliding(enemies[j])
    }
  }
}