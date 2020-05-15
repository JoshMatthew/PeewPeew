function Player() {
  this.size = { w: 30, h: 30 }
  this.pos = newPos(canv.width / 2 - this.size.w, canv.height / 2 - this.size.h)
  this.vector = newVector(0, 0)
  let that = this

  this.autoFire = false

  this.shooting = false
  this.event = {}
  this.mpos = newVector(0, 0)

  this.positionHistory = []

  this.drawParticle = function () {
    that.positionHistory.forEach(particle => {
      particle.draw()
      particle.move()
      that.cutParticleNumber()
    })
  }

  this.cutParticleNumber = function () {
    if (that.positionHistory.length > 30) {
      that.positionHistory.splice(0, 1)
    }
  }

  this.draw = function () {
    ctx.fillStyle = '#111'
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  }

  this.move = function () {
    applyVector(this.pos, multVector(this.vector, newVector(0.97, 0.97)))
    let particle = new Particle(this)
    that.positionHistory.push(particle)
  }

  this.shoot = function () {
    let blt = new Bullet()
    blt.pos.x = that.pos.x + (that.size.w / 2)
    blt.pos.y = that.pos.y + (that.size.h / 2)

    blt.vector.dx = that.mpos.dx / 20
    blt.vector.dy = that.mpos.dy / 20
    bullets.push(blt)
  }

  this.autoFiring = function () {
    if (that.autoFire && that.shooting) {
      that.shoot()
    }
  }

  document.addEventListener('keydown', e => {
    let key = e.keyCode
    const SPACE = 32
    const CHANGE_MODE = 81

    if (key === CHANGE_MODE) {
      that.autoFire = !that.autoFire
    }

    if (key === SPACE && that.autoFire) {
      if (!that.shooting) {
        that.shooting = true
      } else {
        that.shooting = false
      }
    }

    if (key === SPACE && !that.autoFire) {
      if (!that.shooting) {
        that.shoot()
        that.shooting = true
      }
    }
  })

  document.addEventListener('keyup', e => {
    let key = e.keyCode
    const SPACE = 32

    if (key === SPACE) {
      that.shooting = false
    }
  })

  canv.addEventListener('mousedown', e => {
    let mousePos = getMousePos(e)

    this.mpos.dx = (mousePos.x - (this.pos.x + (this.size.w / 2)))
    this.mpos.dy = (mousePos.y - (this.pos.y + (this.size.h / 2)))

    this.vector.dx = that.mpos.dx / 25
    this.vector.dy = that.mpos.dy / 25
  })

  canv.addEventListener('mousemove', e => {
    let mousePos = getMousePos(e)

    this.mpos.dx = (mousePos.x - (this.pos.x + (this.size.w / 2)))
    this.mpos.dy = (mousePos.y - (this.pos.y + (this.size.h / 2)))

  })
}