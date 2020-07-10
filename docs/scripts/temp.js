class Player {

  constructor() {
    this.MOUSE = 'mouse'
    this.WASD = 'wasd'
    this.AMMO_SIZE = 18
    this.CLIPS = 5
    this.SPEED = 5

    // INITIALIZE PLAYER PROPERTIES
    this.size = { w: 30, h: 30 } // The size of the player
    this.pos = HelperFunctions.newPos(canv.width / 2 - this.size.w, canv.height / 2 - this.size.h) // position of the player in the canvas (in this case its initially in the center)
    this.vector = HelperFunctions.newVector(0, 0) // initially sets the vector to 0 for both x and y
    this.color = '#111' // color of the player
    this.life = 100
    this.speed = this.SPEED

    // Player controls
    this.control = window.localStorage.getItem('controls')
    this.friction = 0.98

    // Firing mechanism
    this.autoFire = false // Auto firing off when false, on otherwise
    this.shooting = false // This property is set so player can't autofire when autofire is off
    this.reloading = false
    this.bulletDirection = {}
    this.bullets = []
    this.bulletDamage = { semiAuto: 25, auto: 10 }
    this.mouseAim = {}
    this.ammo = this.AMMO_SIZE
    this.clips = this.CLIPS

    // Volume and sound configuration
    this.gunVolume = 0.350
    this.hitVolume = 0.105
    this.reloadVolume = 0.150
    this.noAmmoVolume = 0.105
    this.reloadGunVolume = 0.650


    this.mpos = HelperFunctions.newVector(0, 0) // The vector that points to the mouse

    this.positionHistory = [] // Array of particles of the player
  }

  // ================================

  // PLAYER OBJECT METHODS

  // Particle Methods

  drawParticle() { // show the particle to the canvas
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
  if (!that.reloading) {
    if (that.ammo > 0) {
      let blt = new Bullet()
      blt.pos.x = that.pos.x + (that.size.w / 2) // Centers the bullet starting point
      blt.pos.y = that.pos.y + (that.size.h / 2) // to the players body

      blt.damage = that.autoFire ? that.bulletDamage.auto : that.bulletDamage.semiAuto // Specifies the damage that varies from the value of autoFire

      blt.vector.dx = that.bulletDirection.dx // Sets the vector of the bullet 
      blt.vector.dy = that.bulletDirection.dy // to the mouse pos
      that.bullets.push(blt) // Push the bullet object to bullets array

      let audio = new Audio('../assets/sfx/player-gun.mp3')
      audio.volume = that.gunVolume
      audio.play()

      that.ammo--
    } else {
      let audio = new Audio('../assets/sfx/no-ammo.mp3')
      audio.volume = that.noAmmoVolume
      audio.play()
    }
  }
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
  ctx.fillText(`Life: ${that.life}`, 30, 30);
  ctx.font = "18px Arial";
  ctx.fillText(`Ammo: ${that.ammo}`, 30, 80);
  ctx.fillText(`Clips: ${that.clips}`, 30, 110);
}

this.move = function () { // Moves the player and show particles at the same time
  applyVector(this.pos, multVector(that.vector, newVector(that.friction, that.friction)))
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
  that.mouseAim = mousePos
}

// ================================

// Event Listeners
canv.addEventListener('mousemove', e => { // aim the gun according to mouse position
  that.updateBulletDirection(e)
  that.bulletDirection = multiplyVectors(normalizeVector(that.bulletDirection), 7) // normalizing the vector's magnitude to 1 then multiplying it to 7 to scale it up

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(that.pos.x, that.pos.y)
  ctx.lineTo(that.mouseAim.dx, that.mouseAim.dy)
  // ctx.lineTo(50, 40)
  ctx.stroke()

  // this one is scaled to 15 since this one is used for bullet speed and the other one is for player's speed
})

document.addEventListener('keydown', e => {
  let key = e.keyCode
  const CHANGE_MODE = 81 // 81 is the keycode for 'q' key
  const RELOAD = 82 // 82 is the keycode for 'r' key

  if (key === CHANGE_MODE) { // change the firing mode when 'q' key is pressed
    let audio = new Audio("../assets/sfx/reload.mp3")
    audio.volume = that.reloadVolume
    audio.play()
    that.autoFire = !that.autoFire
  }

  if (key === RELOAD) {
    if (!that.reloading) {
      if (that.clips > 0) {
        if (that.ammo !== this.AMMO_SIZE) {
          let audio = new Audio("../assets/sfx/reload-gun.mp3")
          audio.volume = that.reloadGunVolume
          audio.play()

          setTimeout(() => {
            that.reloading = !that.reloading
            that.ammo = this.AMMO_SIZE
            that.clips--
          }, 2000)

          that.reloading = !that.reloading
        }
      }
    }
  }
})


// Controls 
if (that.control === this.MOUSE) {
  canv.addEventListener('mousedown', e => { // moves the player according to mouse position
    that.updateMousePos(e)
    that.vector = multiplyVectors(normalizeVector(that.mpos), that.speed) // normalizing the vector's magnitude to 1 then multiplying it to scale it up
  })

  document.addEventListener('keydown', e => { // Event listener to fire and also change firing mode
    let key = e.keyCode // sets the keycode to 'key' variable
    const SPACE = 32 // 32 is the keycode for SPACE

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
}

if (that.control === this.WASD) {
  document.addEventListener('keydown', e => {
    let key = e.keyCode
    const [UP, RIGHT, DOWN, LEFT] = [87, 68, 83, 65]

    if (key === UP) {
      that.vector.dy = -that.speed
    }
    if (key === RIGHT) {
      that.vector.dx = that.speed
    }
    if (key === DOWN) {
      that.vector.dy = that.speed
    }
    if (key === LEFT) {
      that.vector.dx = -that.speed
    }
  })

  canv.addEventListener('mousedown', () => {
    if (that.autoFire) { // fires automatically when space is pressed and autofire is on
      if (!that.shooting) {
        that.shooting = true
      } else {
        that.shooting = false
      }
    }

    if (!that.autoFire) { // fires manually when space is pressed and autofire is off
      if (!that.shooting) {
        that.shoot()
        that.shooting = true
      }
    }
  })

  canv.addEventListener('mouseup', e => {
    that.shooting = false
  })
}
}