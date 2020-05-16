// SET UP CANVAS AND GAME CONTEXT
const canv = document.getElementById('cnv')
canv.width = window.visualViewport.width
canv.height = window.visualViewport.height
const ctx = canv.getContext('2d')
// ================================

// SET UP GLOBAL VARIABLES
let bullets = []

let enemies = []
const enemyNum = 11

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
  initializeBullets(bullets)
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
  ctx.fillStyle = '#406279'
  ctx.fillRect(0, 0, canv.width, canv.height)
}

function start() {
  drawWindow()
  setUp()
}

// =================================

// INITIALIZATION FUNCTIONS FOR EACH GAME OBJECTS

// Player
function initializePlayer(player) {
  wall(player)
  player.draw()
  player.drawParticle()
  player.move()
  player.autoFiring()
}

// Bullets
function initializeBullets(bullets) {
  bullets.forEach(blt => {
    let idx = bullets.indexOf(blt)
    blt.move()
    blt.draw()
    blt.enemyIsHit(idx, enemies)
    blt.isOutOfBounds(bullets)
  })
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
    enemy.move()
    for (let i = 0; i < enemies.length; i++) {
      if (i !== idx && enemy.isColliding(enemies[i])) {
        // todo
      }
    }
  })
}

// =================================

// FUNCTION DECLARATIONS TO START THE GAME
drawWindow()
setInterval(start, 1000 / 60)
// =================================