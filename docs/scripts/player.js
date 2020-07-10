const life_ = document.querySelector('#life')
const ammo_ = document.querySelector('#ammo')
const clips_ = document.querySelector('#clips')

class Player {
  constructor() {
    this.MOUSE = 'mouse'
    this.WASD = 'wasd'
    this.AMMO_SIZE = 18 // The default number of bullets
    this.CLIPS = 5 // The default number of clips
    this.SPEED = 5 // The default speed of the player

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
    this.positionHistory.forEach(particle => {
      particle.draw()
      particle.move()
      this.cutParticleNumber()
    })
  }

  cutParticleNumber() { // to keep optimization, this keeps the particle array neat and few
    if (this.positionHistory.length > 30) {
      this.positionHistory.splice(0, 1)
    }
  }

  // ================================

  // Gun Methods

  // Under construction
  // this.drawGun = function () {
  //   let pistol = new Gun(that)
  //   pistol.vector.dx = this.pos.x
  //   pistol.vector.dy = this.pos.y
  //   pistol.drawGun()
  // }

  shoot() { // Shoot method that shoots bullet according to firing mode and mouse position
    if (!this.reloading) {
      if (this.ammo > 0) {
        let blt = new Bullet()
        blt.pos.x = this.pos.x + (this.size.w / 2) // Centers the bullet starting point
        blt.pos.y = this.pos.y + (this.size.h / 2) // to the players body

        blt.damage = this.autoFire ? this.bulletDamage.auto : this.bulletDamage.semiAuto // Specifies the damage that varies from the value of autoFire

        blt.vector.dx = this.bulletDirection.dx // Sets the vector of the bullet 
        blt.vector.dy = this.bulletDirection.dy // to the mouse pos
        this.bullets.push(blt) // Push the bullet object to bullets array

        let audio = new Audio('../assets/sfx/player-gun.mp3')
        audio.volume = this.gunVolume
        audio.play()

        this.ammo--
      } else {
        let audio = new Audio('../assets/sfx/no-ammo.mp3')
        audio.volume = this.noAmmoVolume
        audio.play()
      }
    }
  }

  autoFiring() {
    if (this.autoFire && this.shooting) { // Shoots bullets continuosly if shooting and autoFire is true
      this.shoot()
    }
  }

  drawBullets(enemies) {
    this.bullets.forEach(blt => {
      let idx = this.bullets.indexOf(blt)
      blt.move()
      blt.draw()
      blt.entityIsHit(idx, enemies, this.bullets)
      blt.isOutOfBounds(this.bullets)
    })
  }

  // ================================

  // Life Manipulation

  hit(damage) {
    if (this.life > 0) {
      this.life -= damage

      let audio = new Audio("../assets/sfx/player-hit.mp3")
      audio.volume = this.hitVolume
      audio.play()
    }
  }

  reset() { // Resets the player properties to default
    // INITIALIZE PLAYER PROPERTIES
    this.pos = HelperFunctions.newPos(canv.width / 2 - this.size.w, canv.height / 2 - this.size.h) // position of the player in the canvas (in this case its initially in the center)
    this.vector = HelperFunctions.newVector(0, 0) // initially sets the vector to 0 for both x and y
    this.life = 100
    this.speed = this.SPEED

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

  }

  // ================================

  // Movement Methods

  showDetails() { // Shows the current life, ammo and clips on the screen
    life_.innerText = this.life
    ammo_.innerText = this.ammo
    clips_.innerText = this.clips
  }

  draw = function (ctx) { // Shows the player on the canvas
    ctx.fillStyle = this.color
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 30
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  }

  move() { // Moves the player and show particles at the same time
    HelperFunctions.applyVector(this.pos, HelperFunctions.multVector(this.vector, HelperFunctions.newVector(this.friction, this.friction)))
    let particle = new Particle(this)
    this.positionHistory.push(particle)
    // this.drawGun()
  }

  updateMousePos(e) { // updates the mpos property according to mouse position
    let mousePos = HelperFunctions.getMousePos(e)
    this.mpos = HelperFunctions.subtractVectors(this.pos, mousePos, this.size) // saves the mouse position to mpos property
  }

  updateBulletDirection(e) { // updates the direction of the bullet
    let mousePos = HelperFunctions.getMousePos(e)
    this.bulletDirection = HelperFunctions.subtractVectors(this.pos, mousePos, this.size) // saves the mouse position to mpos property
    this.mouseAim = mousePos
  }

  // ================================

  // Event Listeners

  playerEvents() { // All the player events in one method, hell yeah.
    canv.addEventListener('mousemove', e => {
      this.updateBulletDirection(e)
      this.bulletDirection = HelperFunctions.multiplyVectors(HelperFunctions.normalizeVector(this.bulletDirection), 7) // normalizing the vector's magnitude to 1 then multiplying it to 7 to scale it up

      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.moveTo(this.pos.x, this.pos.y)
      ctx.lineTo(this.mouseAim.dx, this.mouseAim.dy)
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
        audio.volume = this.reloadVolume
        audio.play()
        this.autoFire = !this.autoFire
      }

      if (key === RELOAD) {
        if (!this.reloading) {
          if (this.clips > 0) {
            if (this.ammo !== this.AMMO_SIZE) {
              let audio = new Audio("../assets/sfx/reload-gun.mp3")
              audio.volume = this.reloadGunVolume
              audio.play()

              setTimeout(() => {
                this.reloading = !this.reloading
                this.ammo = this.AMMO_SIZE
                this.clips--
              }, 2000)

              this.reloading = !this.reloading
            }
          }
        }
      }
    })


    // Controls 
    if (this.control === this.MOUSE) { // The events when player is playing in MOUSE controls
      canv.addEventListener('mousedown', e => { // moves the player according to mouse position
        this.updateMousePos(e)
        this.vector = HelperFunctions.multiplyVectors(HelperFunctions.normalizeVector(this.mpos), this.speed) // normalizing the vector's magnitude to 1 then multiplying it to scale it up
      })

      document.addEventListener('keydown', e => { // Event listener to fire and also change firing mode
        let key = e.keyCode // sets the keycode to 'key' variable
        const SPACE = 32 // 32 is the keycode for SPACE

        if (key === SPACE && this.autoFire) { // fires automatically when space is pressed and autofire is on
          if (!this.shooting) {
            this.shooting = true
          } else {
            this.shooting = false
          }
        }

        if (key === SPACE && !this.autoFire) { // fires manually when space is pressed and autofire is off
          if (!this.shooting) {
            this.shoot()
            this.shooting = true
          }
        }
      })

      document.addEventListener('keyup', e => { // resets the shooting property to false when no longer pressing on space bar
        let key = e.keyCode
        const SPACE = 32

        if (key === SPACE) {
          this.shooting = false
        }
      })
    }

    if (this.control === this.WASD) { // The events when player is playing in WASD controls
      document.addEventListener('keydown', e => {
        let key = e.keyCode
        const [UP, RIGHT, DOWN, LEFT] = [87, 68, 83, 65]

        if (key === UP) {
          this.vector.dy = -this.speed
        }
        if (key === RIGHT) {
          this.vector.dx = this.speed
        }
        if (key === DOWN) {
          this.vector.dy = this.speed
        }
        if (key === LEFT) {
          this.vector.dx = -this.speed
        }
      })

      canv.addEventListener('mousedown', () => {
        if (this.autoFire) { // fires automatically when space is pressed and autofire is on
          if (!this.shooting) {
            this.shooting = true
          } else {
            this.shooting = false
          }
        }

        if (!this.autoFire) { // fires manually when space is pressed and autofire is off
          if (!this.shooting) {
            this.shoot()
            this.shooting = true
          }
        }
      })

      canv.addEventListener('mouseup', e => {
        this.shooting = false
      })
    }
  }

}