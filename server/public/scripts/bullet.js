class Bullet {
  constructor() {
    // Global Variables
    this.size = { w: 3, h: 3 } // Defines the size of the bullet
    this.vector = {} // Bullet speed that varies on the host object
    this.contact = false // A boolean used to check if the bullet is in contact with some object
    this.damage = 25 // the default damage of bullet
    this.color = '#fff' // The default color of the bullet
    this.pos = HelperFunctions.newPos(0, 0) // The position of the bullet is initially set to 0, 0 but eventually will adapt the position of its host object
  }

  isHitHelperFunc(i, object, bullets) { // A helper function to determine if an object is hit or not
    this.isHit(object) // Change the contact property is the bullet gets contact with an entity
    if (this.contact) {
      this.bulletDissolve(i, bullets)
      object.hit(this.damage)
    }
  }

  entityIsHit(i, object, bullets) { // The main function for determining a hit or not
    let type = object.constructor.name // Gets the name of the class. Returns 'Player' if the object is an instance of the Player class and returns 'Array' if the object is an array

    switch (type) {
      case 'Player':
        this.isHitHelperFunc(i, object, bullets)
        break
      case 'Array':
        object.forEach(enemy => {
          this.isHitHelperFunc(i, enemy, bullets)
        })
        break
      default:
        break
    }
  }

  isHit(object) { // Alters the contact property if an entity is hit
    let d = HelperFunctions.dist(this.pos, object)
    this.contact = d < object.size.w ? true : false
  }

  move() { // Moves the bullet
    HelperFunctions.applyVector(this.pos, this.vector)
  }

  bulletDissolve(idx, bullets) { // Dissolves the bullet when there's a contact
    if (this.contact) {
      bullets.splice(idx, 1)
    }
  }

  isOutOfBounds(bullets) { // Also removes the bullet from the bullet array when the bullet goes off the screen
    const oobLEFT = this.pos.x + this.size.w < 0
    const oobTOP = this.pos.y + this.size.h < 0
    const oobRIGHT = this.pos.x + this.size.w > canv.width
    const oobBOTTOM = this.pos.y + this.size.h > canv.height

    if (oobLEFT || oobTOP || oobRIGHT || oobBOTTOM) {
      bullets.splice(0, 1)
    }
  }

  draw() { // Shows the bullet on the screen
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  }
}