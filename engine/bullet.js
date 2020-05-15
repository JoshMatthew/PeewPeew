function Bullet() {
  this.size = { w: 4, h: 4 }
  this.pos = newPos(0, 0)
  this.vector = newVector(5, 5)
  this.contact = false
  this.damage = 25

  let that = this

  this.enemyIsHit = function (idx, enemies) {
    enemies.forEach(enemy => {
      this.isHit(enemy)
      if (this.contact) {
        this.bulletDissolve(idx)
        enemy.hit(that.damage)
      }
    })
  }

  this.isHit = function (enemy) {
    let d = dist(this.pos, enemy)
    this.contact = d.cx < enemy.size.w && d.cy < enemy.size.h ? true : false
  }

  this.move = function () {
    applyVector(this.pos, this.vector)
  }

  this.bulletDissolve = function (idx) {
    if (this.contact) {
      bullets.splice(idx, 1)
    }
  }

  this.isOutOfBounds = function (bullets) {
    const oobLEFT = this.pos.x + this.size.w < 0
    const oobTOP = this.pos.y + this.size.h < 0
    const oobRIGHT = this.pos.x + this.size.w > canv.width
    const oobBOTTOM = this.pos.y + this.size.h > canv.height

    if (oobLEFT || oobTOP || oobRIGHT || oobBOTTOM) {
      bullets.splice(0, 1)
    }
  }

  this.draw = function () {
    ctx.fillStyle = '#fff'
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  }
}