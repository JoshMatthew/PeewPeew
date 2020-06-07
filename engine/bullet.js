function Bullet() {
  this.size = { w: 4, h: 4 }
  this.pos = newPos(0, 0)
  this.vector = newVector(5, 5)
  this.contact = false
  this.damage = 25
  this.color = '#fff'

  let that = this

  this.enemyIsHit = function (idx, enemies, enemyBullets) {
    enemies.forEach(enemy => {
      this.isHit(enemy)
      if (this.contact) {
        this.bulletDissolve(idx, enemyBullets)
        enemy.hit(that.damage)
      }
    })
  }

  this.playerIsHit = function (idx, player, playerBullets) {
    this.isHit(player)
    if (this.contact) {
      this.bulletDissolve(idx, playerBullets)
      player.hit(that.damage)
    }
  }

  this.isHit = function (enemy) {
    let d = dist(this.pos, enemy)
    this.contact = d < enemy.size.w ? true : false
  }

  this.move = function () {
    applyVector(this.pos, this.vector)
  }

  this.bulletDissolve = function (idx, bullets) {
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
    ctx.fillStyle = that.color
    ctx.shadowColor = that.color
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
  }
}