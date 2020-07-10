// This feature is currently under development and doesn't really affect the game

// class Gun {
//   constructor(obj) {
//     this.size = { w: 10, h: 30 }
//     this.color = '#fff'
//     this.mpos = {}
//     this.vector = HelperFunctions.newVector(20, 20)
//     this.pos = {
//       x: obj.pos.x,
//       y: obj.pos.y
//     }
//   }


//   drawGun(ctx) {
//     ctx.strokeStyle = this.color
//     ctx.lineWidth = 10
//     ctx.beginPath()
//     let originX = this.pos.x
//     let originY = this.pos.y

//     ctx.moveTo(originX, originY)
//     ctx.lineTo((this.pos.x + this.vector.dx) - this.vector.dx, (this.pos.y + this.vector.dy) - this.vector.dy)
//     ctx.stroke()
//   }
// }