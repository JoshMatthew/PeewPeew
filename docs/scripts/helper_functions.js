class HelperFunctions {
  static randomVector() { // Returns random vector 
    return {
      dx: this.random(5, -5),
      dy: this.random(5, -5)
    }
  }

  static randomPos(player = null) { // Returns random position

    if (player === null) { // If player is null, it means the one requesting this function call is the player
      return {
        x: this.random(canv.width, 0),
        y: this.random(canv.height, 0)
      }
    } else {
      let x = this.random(canv.width, 0)
      let y = this.random(canv.height, 100)

      while (this.dist(this.newPos(x, y), player) < canv.width / 2) { // This loop prevents the enemy from spawning near the player
        x = this.random(canv.width, 0)
        y = this.random(canv.height, 0)
      }

      return {
        x,
        y
      }
    }
  }

  static applyVector(pos, vector) { // Apply the vector to the current position of an object
    pos.x += vector.dx
    pos.y += vector.dy
  }

  static getMousePos(e) { // Gets the mouse position inside the canvas
    const rect = canv.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  static newVector(dx, dy) { // Returns new vector object
    return { dx, dy }
  }

  static newPos(x, y) { // Returns new position object
    return { x, y }
  }

  static multVector(v1, v2) { // Multiplies 2 vectorsb and return it
    return {
      dx: v1.dx *= v2.dx,
      dy: v1.dy *= v2.dy
    }
  }

  static multiplyVectors(v1, n) { // Multiplies vector to a number and return it
    return {
      dx: v1.dx * n,
      dy: v1.dy * n
    }
  }

  static divVector(vector, n) { // Divides vector to a number and return it
    return {
      dx: vector.dx / n,
      dy: vector.dy / n
    }
  }

  static subtractVectors(v1, v2, size) {  // Subtract 2 vectors with the size and return it
    return {
      dx: v2.x - (v1.x + size.w / 2),
      dy: v2.y - (v1.y + size.h / 2)
    }
  }

  static dist(pos, target) { // Computes the distance from another object 
    let d = Math.abs(Math.sqrt(Math.pow((pos.x - target.pos.x), 2) + Math.pow((pos.y - target.pos.y), 2)))
    return d
  }

  static randomSize() { // Generates random size and return it
    let size = this.random(40, 15)
    return {
      w: size, h: size
    }
  }

  static enemylifeGiver(obj) { // Dynamic life giver for enemy that varies to its size
    if (obj.size.w > 0 && obj.size.w < 21) {
      return 100
    } else if (obj.size.w >= 21 && obj.size.w < 30) {
      return 150
    } else if (obj.size.w >= 30 && obj.size.w <= 40) {
      return 220
    }
  }

  static randomTime() { // Returns random time
    return this.random(2000, 1500)
  }

  static randomMag() { // Reuturns random magnitude
    return this.random(0.01, 0.0007)
  }

  static random(max, min = 1) { // Reuturns random number. Parameters can have max and min. If there's only one argument, the default min is going to be 1
    return Math.random() * (max - min) + min
  }

  static magnitude(vector) { // Computes the magnitude of a vector and returns it
    let mag = 0
    let a = vector.dy
    let b = vector.dx

    mag = Math.abs(Math.sqrt((Math.pow(a, 2)) + (Math.pow(b, 2))))

    return mag
  }

  static normalizeVector(vector) { // Normalize the vector or shrinks its value to 1
    let mag = this.magnitude(vector)
    return this.divVector(vector, mag)
  }

  static listenEvent(from, event, handler) { // A helper function for making an event listener
    return from.addEventListener(event, handler)
  }

  static playAudio(volume, resource) {
    let newAudio = new Audio(resource)
    newAudio.volume = volume
    let playPromise = newAudio.play()

    if (playPromise !== undefined) {
      playPromise.then(() => {

      }).catch(err => {

      })
    }
  }

}