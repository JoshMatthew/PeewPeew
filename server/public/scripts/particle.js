class Particle {
  constructor(obj) {
    this.size = { w: 5, h: 5 } // The size of the particle
    this.pos = { // Sets the position of the particle to the center of the object
      x: obj.pos.x + (obj.size.w / 2),
      y: obj.pos.y + (obj.size.h / 2)
    }
    this.vector = HelperFunctions.newVector(HelperFunctions.random(2, -2), HelperFunctions.random(2, -2)) // Gives random vector to the particle
    this.color = '#00000050' // The default color of the particle
  }

  move() { // Moves the particle
    HelperFunctions.applyVector(this.pos, this.vector)
  }

  draw() { // Shows the particle on the screen
    ctx.fillStyle = this.color
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 2
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
    ctx.fill()
  }
}