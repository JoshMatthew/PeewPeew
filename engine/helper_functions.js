function randomVector() {
  return {
    dx: Math.random() * (5 - (-5)) + (-5),
    dy: Math.random() * (5 - (-5)) + (-5)
  }
}

function randomPos() {
  return {
    x: Math.random() * (800 - 100) + 100,
    y: Math.random() * (800 - 100) + 100
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

function dist(pos, target) {
  let computedX = Math.abs(pos.x - target.pos.x)
  let computedY = Math.abs(pos.y - target.pos.y)
  return { cx: computedX, cy: computedY }
}

function randomSize() {
  let size = Math.random() * (20 - 15) + 15
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