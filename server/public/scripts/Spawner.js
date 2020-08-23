class Spawner {
  createClip(perks) {
    const clip = new Clip(perks)
    perks.push(clip)
  }

  createSpeed(perks) {
    const speed = new Speed()
    perks.push(speed)
  }
}