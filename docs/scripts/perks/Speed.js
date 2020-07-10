// This feature is currently under development and doesn't really affect the game


// class Speed {
//   constructor() {
//     this.size = 10 // The size of the perk which is speed
//     this.color = '#fffd7a' // The color of the perk
//     this.pos = HelperFunctions.randomPos() // A random position for the perk
//   }


//   spawn() { // Spawn method
//     setTimeout(() => { spawner.createClip() }, random(30000, 5000))
//   }

//   autoRemove(i) { // Method for autoremoving the perk
//     setTimeout(() => {
//       console.log(1)
//       this.remove(i)
//     }, 5000)
//   }

//   draw() { // Draws the perk on the canvas
//     ctx.fillStyle = this.color
//     ctx.shadowColor = this.color
//     ctx.shadowBlur = 30
//     ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size)
//   }

//   isTaken(i, player) { // Method that checks if the player took this perk
//     let d = HelperFunctions.dist(this.pos, player)
//     if (d < player.size.w) {
//       player.speed *= 2
//       this.spawn(i)
//       this.remove(i)
//     }
//   }

//   remove(i) { // Remove this perk from perks array
//     perks.splice(i, 1)
//   }
// }