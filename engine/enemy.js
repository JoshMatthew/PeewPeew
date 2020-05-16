function Enemy() {

  // INITIALIZE ENEMY PROPERTIES
  this.size = randomSize()
  this.life = enemylifeGiver(this)
  this.pos = randomPos()
  this.vector = { dx: 0, dy: 0 } // Pretty weird property name but this vector here indicates the position of the player so it can follor it
  this.isHit = false // a boolean that varies if this enemy is freaking hit

  // Enemy color variations
  this.defaultColor = '#00ff1050'
  this.hitColor = '#ff100050' // the color when this enemy is hit
  this.color = this.defaultColor

  // Enemy particles initial properties
  this.particles = []
  this.particlePos = newPos(this.pos.x, this.pos.y)

  // Global variables
  const that = this // This is weird, but the 'that' constant represents the object's 'this' so it can be accessible in inner scopes
  const bloodNumber = 5 // number of blood particles (keep it low so it is not too graphic)

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
  }

  this.isDead = function (idx) { // deletes this enemy into existence when dead ( not really it just got recycled into the memory)
    if (that.life <= 0) {
      enemies.splice(idx, 1)
    }
  }

  // =================================

  // Enemy movements methods

  this.isColliding = function (obj) { // checks if this object is colliding to another enemy
    let d = dist(that.pos, obj)
    return d.cx < obj.size.w && d.cy < obj.size.h ? true : false // returns true if the distance to other enemy is less than this enemy's width and height, false otherwise
  }

  this.follow = function (obj) { // sets this enemy's vector to the object's in this case the players position
    that.vector.dx = (obj.pos.x - (that.pos.x + (that.size.w / 2))) * randomMag()
    that.vector.dy = (obj.pos.y - (that.pos.y + (that.size.h / 2))) * randomMag()
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
    if (that.color === that.hitColor) {
      setTimeout(() => {
        that.color = that.defaultColor // sets the color of the enemy to normal after 100 ms
      }, 100)
    }

    ctx.fillStyle = that.color
    ctx.fillRect(that.pos.x, that.pos.y, that.size.w, that.size.h)
  }

  // =================================
}