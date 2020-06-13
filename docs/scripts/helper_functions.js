function randomVector() {
  return {
    dx: Math.random() * (5 - (-5)) + (-5),
    dy: Math.random() * (5 - (-5)) + (-5)
  }
}

function randomPos(player = null) {

  if (player === null) {
    return {
      x: random(canv.width, 0),
      y: random(canv.height, 0)
    }
  } else {
    let x = random(canv.width, 0)
    let y = random(canv.height, 100)

    while (dist(newPos(x, y), player) < canv.width / 2) {
      x = random(canv.width, 0)
      y = random(canv.height, 0)
    }

    return {
      x,
      y
    }
  }
}

function applyVector(pos, vector) {
  pos.x += vector.dx
  pos.y += vector.dy
}

function getMousePos(e) {
  const rect = canv.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function newVector(dx, dy) {
  return { dx, dy }
}

function newPos(x, y) {
  return { x, y }
}

function multVector(v1, v2) {
  return {
    dx: v1.dx *= v2.dx,
    dy: v1.dy *= v2.dy
  }
}

function multiplyVectors(v1, n) {
  return {
    dx: v1.dx * n,
    dy: v1.dy * n
  }
}

function divVector(vector, n) {
  return {
    dx: vector.dx / n,
    dy: vector.dy / n
  }
}

function subtractVectors(v1, v2, size) {
  return {
    dx: v2.x - (v1.x + size.w / 2),
    dy: v2.y - (v1.y + size.h / 2)
  }
}
function dist(pos, target) {
  let d = Math.abs(Math.sqrt(Math.pow((pos.x - target.pos.x), 2) + Math.pow((pos.y - target.pos.y), 2)))
  return d
}

function randomSize() {
  let size = random(40, 15)
  return {
    w: size, h: size
  }
}

function enemylifeGiver(obj) {
  if (obj.size.w > 0 && obj.size.w < 21) {
    return 100
  } else if (obj.size.w >= 21 && obj.size.w < 30) {
    return 150
  } else if (obj.size.w >= 30 && obj.size.w <= 40) {
    return 220
  }
}

function randomTime() {
  return Math.random() * (2000 - 1500) + 1500
}

function randomMag() {
  return Math.random() * (0.01 - 0.0007) + 0.0007
}

function random(max, min = 1) {
  return Math.random() * (max - min) + min
}

function magnitude(vector) {
  let mag = 0
  let a = vector.dy
  let b = vector.dx

  mag = Math.abs(Math.sqrt((Math.pow(a, 2)) + (Math.pow(b, 2))))

  return mag
}

function normalizeVector(vector) {
  let mag = magnitude(vector)
  return divVector(vector, mag)
}