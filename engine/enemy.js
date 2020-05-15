function Enemy() {
  this.size = randomSize()
  this.life = enemylifeGiver(this)
  this.pos = randomPos()
  this.vector = randomVector()
  this.vectorToFollow = { dx: 0, dy: 0 }
  this.isHit = false

  this.defaultColor = '#00ff1050'
  this.hitColor = '#ff100050'
  this.deadColor = '#222'

  this.color = this.defaultColor

  let that = this

  this.particles = []

  this.hit = function (damage) {
    that.color = that.hitColor
    that.life -= damage
    that.isHit = true
  }

  this.drawParticle = function () {
    if (that.isHit) {
      setTimeout(() => {
        that.isHit = false
      }, 100)
      // paduguin
      for (let i = 0; i < that.particles.length; i++) {
        let particle = that.particles[i]
        particle.pos = newPos(that.pos.x + (that.size.w / 2) * random(4, -2), that.pos.y + (that.size.h / 2) * random(2, -4))
        particle.draw()
        particle.move()
        that.cutParticleNumber()
      }
    }
  }

  this.cutParticleNumber = function () {
    if (that.particles.length > 15) {
      that.particles.splice(0, 16)
    }
  }

  this.moveAway = function (obj) {
    that.vector.dx *= -100
    that.vector.dy *= -100
  }


  this.isColliding = function (obj) {
    let d = dist(that.pos, obj)
    return d.cx < obj.size.w && d.cy < obj.size.h ? true : false
  }

  this.isDead = function (idx) {
    if (that.life <= 0) {
      that.color = that.deadColor
      enemies.splice(idx, 1)
    }
  }

  this.follow = function (obj) {
    that.vectorToFollow.dx = (obj.pos.x - (that.pos.x + (that.size.w / 2))) * randomMag()
    that.vectorToFollow.dy = (obj.pos.y - (that.pos.y + (that.size.h / 2))) * randomMag()
  }

  this.move = function () {
    applyVector(that.pos, that.vectorToFollow)
    let blood = new Particle(this)
    blood.color = '#ff100050'
    that.particles.push(blood)
  }

  this.draw = function () {
    if (that.color === that.hitColor) {
      setTimeout(() => {
        that.color = that.defaultColor
      }, 100)
    }

    ctx.fillStyle = that.color
    ctx.fillRect(that.pos.x, that.pos.y, that.size.w, that.size.h)
  }
}