// SET UP CANVAS AND GAME CONTEXT
const canv = document.getElementById('cnv')
canv.width = document.body.clientWidth
canv.height = document.body.clientHeight
const ctx = canv.getContext('2d')
// ================================

// SET UP GLOBAL VARIABLES
let gameOn = false
let enemies = []
//let perks = [] // currently unavailable
const enemyNum = 5 // Numbers of enemy
const player1 = new Player()

// Player Event handlers
player1.playerEvents()

// Timing variables to determine how long the player last until the game stops
let inGameTime = 0
let pastTime = 0
let currentTime = 0

// const spawner = new Spawner()
// spawner.createClip()
// spawner.createSpeed()

let winVolume = 0.310
let looseVolume = 0.125

// =================================

// GLOBAL FUNCTIONS TO INITIALIZE GAME

// FUNCTION DECLARATIONS TO START THE GAME
function fillEnemy(i) {
  setTimeout(() => {
    let enemy = new Enemy(player1)
    enemies.push(enemy)
  }, 500 * i)
}

function playGame() { // Function that starts the game
  pastTime = getTime() // Sets the timer

  enemies = [] // resets enemy count
  // Populate enemy array
  for (let i = 0; i < enemyNum; i++) {
    fillEnemy(i)
  }

  player1.reset() // Resets the player

  let interval = setInterval(() => {

    if (!enemies.length) { // If player wins
      stopWin(interval)
    } else
      if (player1.life > 0) { // If player dies
        start()
      } else {
        player1.showDetails() // Updates the details
        stopDead(interval)
      }

  }, 1000 / 60) // Plays it in 60 fps
}

function setUp() {
  initializePlayer(player1)
  initializeEnemies(enemies)
  // initializePerks() // Unavailable
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

function start() { // initialize the game
  drawWindow()
  setUp()
}

function stopDead(interval) { // Function that stops the game when the player dies
  calculateTime() // Calculates the overall time the player spent during his game
  showScore() // Shows the score
  gameOnToggler() // Turns off the game
  HelperFunctions.playAudio(looseVolume, "https://raw.githubusercontent.com/JoshMatthew/PeewPeew/master/assets/sfx/defeat-sound.mp3")

  ctx.shadowColor = null
  ctx.shadowBlur = null
  ctx.fillStyle = '#fff'

  ctx.font = "100px Arial";
  ctx.textAlign = 'center'
  ctx.fillText('YOU LOOSE', canv.width / 2, canv.height / 2 - 150);

  clearInterval(interval)

  toggleModal() // Opens the modal to restart or exit
}

function stopWin(interval) { // Function that stops the game when the player wins
  calculateTime() // Calculates the overall time the player spent during his game
  showScore() // Shows the score
  gameOnToggler() // Turns off the game

  HelperFunctions.playAudio(winVolume, "https://raw.githubusercontent.com/JoshMatthew/PeewPeew/master/assets/sfx/win-sound.mp3")

  ctx.shadowColor = null
  ctx.shadowBlur = null
  ctx.fillStyle = '#fff'

  ctx.font = "100px Arial";

  ctx.textAlign = 'center'
  ctx.fillText('YOU WIN', canv.width / 2, canv.height / 2 - 150);

  clearInterval(interval)

  toggleModal() // Opens the modal to restart or exit
}

function gameOnToggler() { // Alters the gameOn boolean to true or false. True means it's running false means it's not
  gameOn = !gameOn
}

function getTime() { // Returns the current time of the day in seconds
  var today = new Date()
  return today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds()
}

function showScore() { // Calculates and shows score to the screen
  let score = document.querySelector('#score')
  let playerScore = 0
  if (player1.life > 0) {
    playerScore = (100 * player1.life - inGameTime) + player1.clips // The score varies to the amount of life left, minus the time he spent, plus the clips the player remained
  }
  score.innerText = `Score: ${playerScore}`
}

function calculateTime() { // Calculates the time spent
  currentTime = getTime()
  inGameTime = currentTime - pastTime
}

// =================================

// INITIALIZATION FUNCTIONS FOR EACH GAME OBJECTS

// Player
function initializePlayer(player) {
  wall(player)
  player.showDetails()
  player.drawParticle()
  player.draw(ctx)
  player.move()
  // player.drawGun()
  player.autoFiring()
  player.drawBullets(enemies)
}

// Enemies
function initializeEnemies(enemies) {

  if (enemies.length) {
    for (let i = 0; i < enemies.length; i++) {
      wall(enemies[i])
      enemies[i].follow(player1)
      enemies[i].cutParticles()
      enemies[i].draw()
      enemies[i].drawBullets(player1)
      enemies[i].move()
      enemies[i].isColliding(player1)

      for (let j = 0; j < enemies.length; j++) {
        i !== j && enemies[i].isColliding(enemies[j])
      }
      enemies[i].isDead(i)
    }
  }
}

// Perks
// function initializePerks() {
//   for (let i = 0; i < perks.length; i++) {
//     perks[i].draw(i)
//     perks[i].isTaken(i, player1)
//   }
// }