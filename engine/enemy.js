function Enemy() {
  // Global variables
  const that = this // This is weird, but the 'that' constant represents the object's 'this' so it can be accessible in inner scopes
  const bloodNumber = 5 // number of blood particles (keep it low so it is not too graphic)

  // INITIALIZE ENEMY PROPERTIES
  this.size = randomSize()
  this.life = enemylifeGiver(this)
  this.pos = randomPos()
  this.vector = { dx: 0, dy: 0 } // Pretty weird property name but this vector here indicates the position of the player so it can follor it
  this.isHit = false // a boolean that varies if this enemy is freaking hit

  // Enemy color variations
  this.defaultColor = '#00ff10'
  this.hitColor = '#ff100050' // the color when this enemy is hit
  this.color = this.defaultColor

  // Enemy particles initial properties
  this.particles = []
  this.particlePos = newPos(this.pos.x, this.pos.y)
  that.bulletDirection = {}

  // Enemy shooting mechanism
  this.shooting = false
  this.bullets = []

  // ================================

  // ENEMY METHODS

  // Particle methods

  this.fillParticles = function () {
    for (let i = 0; i < bloodNumber; i++) {
      let bloodParticle = new Particle(this) // creates a new particle object
      bloodParticle.color = '#00ff1050'
      bloodParticle.vector = newVector(random(random(2, -2), random(3, -3)), random(random(3, -3), random(2, -2))) // creates a random vector for this specific particle (more randomness more aesthetics)
      that.particles.push(bloodParticle)
    }
  }

  this.cutParticles = function () { // to keep optimization, this keeps the particle array neat and few
    if (that.particles.length > bloodNumber) {
      that.particles.splice(0, 1)
    }
  }

  this.showParticles = function () { // a wrapper method to show the particles to the canvas
    that.updateParticlePos()
    this.fillParticles()
  }

  this.updateParticlePos = function () { // updates the particle's position to the current position of the player
    that.particlePos.x = that.pos.x + (that.size.w / 2) // what's happening here? just centering
    that.particlePos.y = that.pos.y + (that.size.h / 2)
  }

  this.runParticles = function () { // The particles don't want to just sit down, they wanna run.
    for (let i = 0; i < that.particles.length; i++) {
      that.particles[i].draw()
      that.particles[i].move()
    }
  }

  // ================================

  // Enemy life manipulation methods (don't look at me)

  this.hit = function (damage) {
    that.color = that.hitColor
    that.life -= damage
    that.isHit = true
    that.showParticles() // when this enemy is hit, the particles are shown

    let audio = new Audio("engine/enemy-hit.mp3")
    audio.volume = 0.8
    audio.play()
  }

  this.isDead = function (idx) { // deletes this enemy into existence when dead ( not really it just got recycled into the memory)
    if (that.life <= 0) {
      enemies.splice(idx, 1)
    }
  }

  // =================================

  // Enemy shooting mechanism

  this.createBullets = function () {

    if (that.bullets.length < 2) {
      let blt = new Bullet()
      blt.pos.x = that.pos.x + (that.size.w / 2) // Centers the bullet starting point
      blt.pos.y = that.pos.y + (that.size.h / 2) // to the players body
      blt.color = '#00ff00'
      blt.damage = 10

      blt.vector.dx = that.bulletDirection.dx // Sets the vector of the bullet 
      blt.vector.dy = that.bulletDirection.dy // to the mouse pos
      that.bullets.push(blt) // Push the bullet object to bullets array

      let audio = new Audio("engine/enemy-gun.mp3")
      audio.volume = 0.3
      audio.play()
    }
  }

  this.drawBullets = function (player) {
    that.bullets.forEach(blt => {
      let idx = that.bullets.indexOf(blt)
      blt.move()
      blt.draw()
      blt.playerIsHit(idx, player, that.bullets)
      blt.isOutOfBounds(that.bullets)
    })
  }

  this.updateBulletDirection = function (player) {
    let playerPos = player.pos
    that.bulletDirection = subtractVectors(that.pos, playerPos, that.size) // saves the mouse position to mpos property
    that.bulletDirection = multiplyVectors(normalizeVector(that.bulletDirection), 7) // normalizing the vector's magnitude to 1 then multiplying it to 15 to scale it up
  }

  this.fireWeapon = function (player) {
    let d = dist(that.pos, player)
    if (d < that.size.w * 14) {
      return that.shooting = !that.shooting
    }
  }

  // =================================

  // Enemy movements methods

  this.isColliding = function (obj) { // checks if this object is colliding to another enemy
    let d = dist(that.pos, obj)
    return d < (obj.size.w * 1.5) ? true : false // returns true if the distance to other enemy is less than this enemy's width and height, false otherwise
  }

  this.stop = function () {
    that.vector = newVector(0, 0)
  }

  this.follow = function (obj) { // sets this enemy's vector to the object's in this case the players position
    if (that.fireWeapon(obj)) {
      that.createBullets()
    }
    that.updateBulletDirection(obj)
    that.vector = subtractVectors(that.pos, obj.pos, that.size)
    that.vector = normalizeVector(that.vector) // shrinks the vector's magnitude to 1
  }

  this.move = function () {
    if (that.isHit) {
      setTimeout(() => {
        that.isHit = false // sets the state of isHit variable after 1.5 seconds
      }, 1500)
      that.runParticles() // runs or moves the particles if its hit
    }
    applyVector(that.pos, that.vector) // moves the enemy according to its vector
  }

  // =================================

  // Enemy wants to show to the canvas methods 
  this.draw = function () {
    ctx.fillStyle = that.color
    ctx.shadowColor = that.color
    ctx.shadowBlur = 30
    ctx.fillRect(that.pos.x, that.pos.y, that.size.w, that.size.h)

    if (that.color === that.hitColor) {
      setTimeout(() => {
        that.color = that.defaultColor // sets the color of the enemy to normal after 100 ms
      }, 100)
    }
  }

  // =================================
}