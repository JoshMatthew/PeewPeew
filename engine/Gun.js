function Gun(obj) {
  const that = this

  this.size = { w: 10, h: 30 }
  this.color = '#fff'
  this.mpos = {}
  this.vector = newVector(20, 20)
  this.pos = {
    x: obj.pos.x,
    y: obj.pos.y
  }


  this.drawGun = function () {
    ctx.strokeStyle = that.color
    ctx.lineWidth = 10
    ctx.beginPath()
    let originX = that.pos.x
    let originY = that.pos.y

    ctx.moveTo(originX, originY)
    ctx.lineTo((that.pos.x + that.vector.dx) - that.vector.dx, (that.pos.y + that.vector.dy) - that.vector.dy)
    ctx.stroke()
  }
}