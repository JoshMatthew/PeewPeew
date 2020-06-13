function Player() {

  const that = this // This is weird, but the 'that' constant represents the object's 'this' so it can be accessible in inner scopes

  // INITIALIZE PLAYER PROPERTIES
  this.size = { w: 30, h: 30 } // The size of the player
  this.pos = newPos(canv.width / 2 - this.size.w, canv.height / 2 - this.size.h) // position of the player in the canvas (in this case its initially in the center)
  this.vector = newVector(0, 0) // initially sets the vector to 0 for both x and y
  this.color = '#111' // color of the player
  this.life = 100

  // Firing mechanism
  this.autoFire = false // Auto firing off when false, on otherwise
  this.shooting = false // This property is set so player can't autofire when autofire is off
  this.bulletDirection = {}
  this.bullets = []

  // Volume and sound configuration
  this.gunVolume = 0.350
  this.hitVolume = 0.105
  this.reloadVolume = 0.150


  this.mpos = newVector(0, 0) // The vector that points to the mouse

  this.positionHistory = [] // Array of particles of the player

  // ================================

  // PLAYER OBJECT METHODS

  // Particle Methods

  this.drawParticle = function () { // show the particle to the canvas
    that.positionHistory.forEach(particle => {
      particle.draw()
      particle.move()
      that.cutParticleNumber()
    })
  }

  this.cutParticleNumber = function () { // to keep optimization, this keeps the particle array neat and few
    if (that.positionHistory.length > 30) {
      that.positionHistory.splice(0, 1)
    }
  }

  // ================================

  // Gun Methods

  // Under construction
  // this.drawGun = function () {
  //   let pistol = new Gun(that)
  //   pistol.vector.dx = that.pos.x
  //   pistol.vector.dy = that.pos.y
  //   pistol.drawGun()
  // }

  this.shoot = function () { // Shoot method that shoots bullet according to firing mode and mouse position
    let blt = new Bullet()
    blt.pos.x = that.pos.x + (that.size.w / 2) // Centers the bullet starting point
    blt.pos.y = that.pos.y + (that.size.h / 2) // to the players body

    blt.damage = that.autoFire ? 10 : 25 // Specifies the damage that varies from the value of autoFire

    blt.vector.dx = that.bulletDirection.dx // Sets the vector of the bullet 
    blt.vector.dy = that.bulletDirection.dy // to the mouse pos
    that.bullets.push(blt) // Push the bullet object to bullets array

    let audio = new Audio('../assets/sfx/player-gun.mp3')
    audio.volume = that.gunVolume
    audio.play()
  }

  this.autoFiring = function () {
    if (that.autoFire && that.shooting) { // Shoots bullets continuosly if shooting and autoFire is true
      that.shoot()
    }
  }

  this.drawBullets = function (enemies) {
    that.bullets.forEach(blt => {
      let idx = that.bullets.indexOf(blt)
      blt.move()
      blt.draw()
      blt.enemyIsHit(idx, enemies, that.bullets)
      blt.isOutOfBounds(that.bullets)
    })
  }

  // ================================

  // Life Manipulation

  this.hit = function (damage) {
    if (that.life > 0) {
      that.life -= damage

      let audio = new Audio("../assets/sfx/player-hit.mp3")
      audio.volume = that.hitVolume
      audio.play()
    }
  }

  // ================================

  // Movement Methods

  this.draw = function () { // Shows the player on the canvas
    ctx.fillStyle = that.color
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 30
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)


    ctx.shadowColor = null
    ctx.shadowBlur = null
    ctx.fillStyle = '#fff'

    ctx.font = "30px Arial";
    ctx.fillText(that.life, 30, 30);
  }

  this.move = function () { // Moves the player and show particles at the same time
    applyVector(this.pos, multVector(this.vector, newVector(0.98, 0.98)))
    let particle = new Particle(this)
    that.positionHistory.push(particle)
    // that.drawGun()
  }

  this.updateMousePos = function (e) { // updates the mpos property according to mouse position
    let mousePos = getMousePos(e)
    that.mpos = subtractVectors(that.pos, mousePos, that.size) // saves the mouse position to mpos property
  }

  this.updateBulletDirection = function (e) { // updates the direction of the bullet
    let mousePos = getMousePos(e)
    that.bulletDirection = subtractVectors(that.pos, mousePos, that.size) // saves the mouse position to mpos property
  }

  // ================================

  // Event Listeners

  document.addEventListener('keydown', e => { // Event listener to fire and also change firing mode
    let key = e.keyCode // sets the keycode to 'key' variable
    const SPACE = 32 // 32 is the keycode for SPACE
    const CHANGE_MODE = 81 // 81 is the keycode for 'q' key

    if (key === CHANGE_MODE) { // change the firing mode when 'q' key is pressed
      let audio = new Audio("../assets/sfx/reload.mp3")
      audio.volume = that.reloadVolume
      audio.play()
      that.autoFire = !that.autoFire
    }

    if (key === SPACE && that.autoFire) { // fires automatically when space is pressed and autofire is on
      if (!that.shooting) {
        that.shooting = true
      } else {
        that.shooting = false
      }
    }

    if (key === SPACE && !that.autoFire) { // fires manually when space is pressed and autofire is off
      if (!that.shooting) {
        that.shoot()
        that.shooting = true
      }
    }
  })

  document.addEventListener('keyup', e => { // resets the shooting property to false when no longer pressing on space bar
    let key = e.keyCode
    const SPACE = 32

    if (key === SPACE) {
      that.shooting = false
    }
  })

  canv.addEventListener('mousedown', e => { // moves the player according to mouse position
    that.updateMousePos(e)
    that.vector = multiplyVectors(normalizeVector(that.mpos), 5) // normalizing the vector's magnitude to 1 then multiplying it to 5 to scale it up
  })

  canv.addEventListener('mousemove', e => { // aim the gun according to mouse position
    that.updateBulletDirection(e)
    that.bulletDirection = multiplyVectors(normalizeVector(that.bulletDirection), 7) // normalizing the vector's magnitude to 1 then multiplying it to 7 to scale it up

    // this one is scaled to 15 since this one is used for bullet speed and the other one is for player's speed
  })
}