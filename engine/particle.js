function Particle(obj) {
  this.size = { w: 5, h: 5 }
  this.pos = {
    x: obj.pos.x + (obj.size.w / 2),
    y: obj.pos.y + (obj.size.h / 2)
  }
  this.vector = newVector(random(2, -2), random(2, -2))
  this.color = '#00000050'
  let that = this

  this.move = function () {
    applyVector(that.pos, that.vector)
  }

  this.draw = function () {
    ctx.fillStyle = that.color
    ctx.fillRect(that.pos.x, that.pos.y, that.size.w, that.size.h)
    ctx.fill()
  }
}