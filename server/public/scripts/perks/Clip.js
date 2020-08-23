// This feature is currently under development and doesn't really affect the game

// class Clip {
//   constructor() {
//     this.size = 10 // The size of the perk which is a clip
//     this.color = '#ff0a9d' // The color of the perk
//     pos = HelperFunctions.randomPos() // A random position for the perk
//   }

//   spawn(i) { // Spawn method
//     setTimeout(() => {
//       this.remove(i)
//     }, 5000)
//   }

//   autoRemove(i) { // Method for autoremoving the perk
//     setTimeout(() => {
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
//       player.clips++ // If taken, player clips will increment
//       this.spawn(i) // After it is taken, another one will spawn
//     }
//   }

//   remove(i) { // Remove this perk from perks array
//     perks.splice(i, 1)
//   }
// }
