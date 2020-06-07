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

// Populate enemy array
for (let i = 0; i < enemyNum; i++) {
  let enemy = new Enemy()
  enemies.push(enemy)
}
// =================================

// GLOBAL FUNCTIONS TO INITIALIZE GAME
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

function stop(interval) {
  let audiio = new Audio("./win-sound.mp3")
  console.log(audio)
  audiio.volume = 0.6
  audiio.play()

  ctx.shadowColor = null
  ctx.shadowBlur = null
  ctx.fillStyle = '#fff'

  ctx.font = "100px Arial";
  ctx.fillText('YOU WIN', canv.width / 2 - 200, canv.height / 2);

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
  enemies.forEach(enemy => {
    let idx = enemies.indexOf(enemy)
    wall(enemy)
    enemy.isDead(idx)
    enemy.follow(player1)
    enemy.cutParticles()
    enemy.draw()
    enemy.drawBullets(player1)
    enemy.move()
    for (let i = 0; i < enemies.length; i++) {
      if (i !== idx && enemy.isColliding(enemies[i])) {
        enemy.vector = newVector(0, 0)
      } else {
      }
    }
  })
}

// =================================

// FUNCTION DECLARATIONS TO START THE GAME
drawWindow()
let interval = setInterval(() => {
  enemies.length ? start() : stop(interval)
}, 1000 / 60)
// =================================