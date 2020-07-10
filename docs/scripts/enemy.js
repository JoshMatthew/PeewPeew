class Enemy {
  constructor(player) {
    // Global variables
    this.bloodNumber = 5 // number of blood particles (keep it low so it is not too graphic)

    // INITIALIZE ENEMY PROPERTIES
    this.size = HelperFunctions.randomSize()
    this.life = HelperFunctions.enemylifeGiver(this)
    this.pos = HelperFunctions.randomPos(player)
    this.vector = { dx: 0, dy: 0 } // Pretty weird property name but this vector here indicates the position of the player so it can follow it
    this.isHit = false // a boolean that varies if this enemy is freaking hit

    // Enemy color variations
    this.defaultColor = '#00ff10'
    this.hitColor = '#ff100050' // the color when this enemy is hit
    this.color = this.defaultColor

    // Enemy particles initial properties
    this.particles = []
    this.particlePos = HelperFunctions.newPos(this.pos.x, this.pos.y)
    this.bulletDirection = {}

    // Enemy shooting mechanism
    this.shooting = false
    this.bullets = []
    this.bulletDamage = 10

    // Volume and sound configuration
    this.gunVolume = 0.110
    this.hitVolume = 0.210
  }

  // ================================

  // ENEMY METHODS

  // Particle methods

  fillParticles() {
    for (let i = 0; i < this.bloodNumber; i++) {
      let bloodParticle = new Particle(this) // creates a new particle object
      bloodParticle.color = '#00ff1050'
      bloodParticle.vector = HelperFunctions.newVector(HelperFunctions.random(HelperFunctions.random(2, -2), HelperFunctions.random(3, -3)), HelperFunctions.random(HelperFunctions.random(3, -3), HelperFunctions.random(2, -2))) // creates a random vector for this specific particle (more randomness more aesthetics)
      this.particles.push(bloodParticle)
    }
  }

  cutParticles() { // to keep optimization, this keeps the particle array neat and few
    if (this.particles.length > this.bloodNumber) {
      this.particles.splice(0, 1)
    }
  }

  showParticles() { // a wrapper method to show the particles to the canvas
    this.updateParticlePos()
    this.fillParticles()
  }

  updateParticlePos() { // updates the particle's position to the current position of the player
    this.particlePos.x = this.pos.x + (this.size.w / 2) // what's happening here? just centering
    this.particlePos.y = this.pos.y + (this.size.h / 2)
  }

  runParticles() { // The particles don't want to just sit down, they wanna run.
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw()
      this.particles[i].move()
    }
  }

  // ================================

  // Enemy life manipulation methods (don't look at me)

  hit(damage) {
    this.color = this.hitColor
    this.life -= damage
    this.isHit = true
    this.showParticles() // when this enemy is hit, the particles are shown

    let audio = new Audio("../assets/sfx/enemy-hit.mp3")
    audio.volume = this.hitVolume
    audio.play()
  }

  isDead(i) { // deletes this enemy into existence when dead ( not really it just got recycled into the memory)
    if (this.life <= 0) {
      enemies.splice(i, 1)
    }
  }

  // =================================

  // Enemy shooting mechanism

  createBullets() {

    if (this.bullets.length < 2) {
      let blt = new Bullet()
      blt.pos.x = this.pos.x + (this.size.w / 2) // Centers the bullet starting point
      blt.pos.y = this.pos.y + (this.size.h / 2) // to the players body
      blt.color = '#00ff00'
      blt.damage = this.bulletDamage

      blt.vector.dx = this.bulletDirection.dx // Sets the vector of the bullet 
      blt.vector.dy = this.bulletDirection.dy // to the mouse pos
      this.bullets.push(blt) // Push the bullet object to bullets array

      let audio = new Audio("../assets/sfx/enemy-gun.mp3")
      audio.volume = this.gunVolume
      audio.play()
    }
  }

  drawBullets(player) {
    this.bullets.forEach(blt => {
      let idx = this.bullets.indexOf(blt)
      blt.move()
      blt.draw()
      blt.entityIsHit(idx, player, this.bullets)
      blt.isOutOfBounds(this.bullets)
    })
  }

  updateBulletDirection(player) {
    let playerPos = player.pos
    this.bulletDirection = HelperFunctions.subtractVectors(this.pos, playerPos, this.size) // saves the mouse position to mpos property
    this.bulletDirection = HelperFunctions.multiplyVectors(HelperFunctions.normalizeVector(this.bulletDirection), 9) // normalizing the vector's magnitude to 1 then multiplying it to 9 to scale it up
  }

  fireWeapon(player) {
    let d = HelperFunctions.dist(this.pos, player)
    if (d < this.size.w * 14) {
      return this.shooting = !this.shooting
    }
  }

  // =================================

  // Enemy movements methods

  isColliding(obj) { // checks if this object is colliding to another enemy
    // Nothing crazy here, just stoping when this object is near to another Enemy or to the Player
    let d = HelperFunctions.dist(this.pos, obj)
    if (obj.constructor.name === 'Player') {
      if (d < (obj.size.w * 5)) {
        this.stop()
      }
    } else if (obj.constructor.name === 'Enemy') {
      if (d < (obj.size.w * 1.5)) {
        this.stop()
      }
    }
  }

  stop() { // reverts the vector against the other enemy object to prevent them from stacking
    HelperFunctions.applyVector(this.pos, HelperFunctions.multiplyVectors(this.vector, -2))
  }

  follow(obj) { // sets this enemy's vector to the object's in this case the players position
    if (this.fireWeapon(obj)) {
      this.createBullets()
    }
    this.updateBulletDirection(obj)
    this.vector = HelperFunctions.subtractVectors(this.pos, obj.pos, this.size)
    this.vector = HelperFunctions.normalizeVector(this.vector) // shrinks the vector's magnitude to 1
  }

  move() {
    if (this.isHit) {
      setTimeout(() => {
        this.isHit = false // sets the state of isHit variable after 1.5 seconds
      }, 1500)
      this.runParticles() // runs or moves the particles if its hit
    }
    HelperFunctions.applyVector(this.pos, this.vector) // moves the enemy according to its vector
  }

  // =================================

  // Enemy wants to show to the canvas methods 
  draw() {
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 30
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)

    if (this.color === this.hitColor) {
      setTimeout(() => {
        this.color = this.defaultColor // sets the color of the enemy to normal after 100 ms
      }, 100)
    }

    ctx.closePath()
  }

  // =================================
}